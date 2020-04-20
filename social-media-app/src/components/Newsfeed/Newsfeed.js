import React, { Component } from 'react';
import firebase from '../../config/Firebase';
import axios from '../../axios';

import NewsFeedCard from './NewsFeedCard/NewsFeedCard';

class NewsFeed extends Component {

    _isMounted = false;

    state = {
        loading: true,
        user: null,
        friendStatusData: "",
        displayFriendStatusData: 5,
        friendsInformation: [],
        userFriendsId: [],
        userStatusUpdate: ""
    }

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
       this._isMounted = false;
    }

    getData = () => {
        this._isMounted = true;

        var user = firebase.auth().currentUser;
        this.setState({ user });
        const userId = localStorage.getItem('user');

        

        axios.get(`/userInformation/${userId}.json`)
            .then(response => {
                
                let userFriendsId = [localStorage.getItem('user')];
                for (let key in response.data) {
                    let friendsList = response.data[key].friends.friendsList
                    for (let friendKey in friendsList) {
                        if (friendsList[friendKey].friendId !== undefined) {
                            userFriendsId.push(friendsList[friendKey].friendId)
                        }
                    }
                }
                this.setState({userFriendsId})

            })
            .then(response => {

                let friendsInformation = [];
                for (let key in this.state.userFriendsId) {
                    axios.get(`/userInformation/${this.state.userFriendsId[key]}.json`)
                        .then(response => {
                            let keyFriends = Object.keys(response.data)
                            friendsInformation.push({
                                ...response.data[keyFriends],
                                friendId2: this.state.userFriendsId[key]
                            })
                        })
                }
                this.setState({friendsInformation})
            })
            .then(response => {
                
                let friendsStatusUpdates = [];
                for (let id in this.state.userFriendsId) {
                    let friendId = this.state.userFriendsId[id]
                    axios.get(`/userStatusUpdate/${friendId}.json`)
                        .then(response => {

                           

                            for (let key2 in this.state.friendsInformation) {
                                let friendId2 = this.state.friendsInformation[key2].friendId2

                                for (let key in response.data) {
                                    if (friendId2 === friendId) {
                                        friendsStatusUpdates.push({ 
                                            ...response.data[key],
                                            ...this.state.friendsInformation[key2],
                                            id: key
                                         })
                                    }
                                }
                            }

                            const sortedDate = friendsStatusUpdates.sort((a, b) => new Date(b.date) - new Date(a.date))
                            this.setState({loading: false, friendStatusData: sortedDate, userStatusUpdate: ""})

                            if (this._isMounted) {
                                this.setState({loading: false})
                            }

                            // if (this._isMounted) {
                            //     const sortedDate = friendsStatusUpdates.sort((a, b) => new Date(b.date) - new Date(a.date))
                            //     this.setState({loading: false, friendStatusData: sortedDate})
                            // }
                            
                    })  
                     
                }
            })
    }

    showMoreHandler = () => {
        this.setState((prevState) => ({
            displayFriendStatusData: prevState.displayFriendStatusData + 5
        }))
    }

    onChangeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitButton = () => {

        if (this.state.userStatusUpdate !== "") {
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + 
            ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            const addNewStatus = {
                statusUpdate: this.state.userStatusUpdate,
                date: date,
                comment: {dumbValue: "null"},
                like: {dumbValue: "null"}
            }

            const userId = localStorage.getItem('user');

            axios.post('./userStatusUpdate/' + userId + '.json', addNewStatus)
                .then(response => this.getData())

        }
        
        
    }

    render() {

        let insertStatusUpdates = "";
        if (!this.state.loading) {
            insertStatusUpdates = this.state.friendStatusData
                .slice(0, this.state.displayFriendStatusData)
                .map(item => (
                    <div key={item.id}>
                        <NewsFeedCard userStatus={item} />
                    </div>
                ))
        }

    

        return (
            <div style={{color:"white"}}>
                <h1 style={{fontSize: "50px"}}>News Feed</h1>
                
                <input
                    style={{
                        color: "white",
                        backgroundColor: "rgb(59, 58, 58)",
                        borderStyle: "none",
                        borderRadius: "20px",
                        width: "300px",
                        height: "30px",
                        fontSize: "medium",
                        textAlign: "center"
                    }}
                    placeholder="What's on your mind..."
                    type="text"
                    name="userStatusUpdate"
                    value={this.state.userStatusUpdate}
                    onChange={this.onChangeHandler}
                />
                
                 <input
                    style={{
                        color: "white",
                        backgroundColor: "black",
                        fontsize: "medium",
                        borderColor: "black",
                        padding: "10px",
                        margin: "0px 0px 0px 10px"

                    }}
                    type="submit"
                    onClick={this.submitButton}
                />
                <br></br>

                {insertStatusUpdates}

                {
                    (this.state.displayFriendStatusData >= this.state.friendStatusData.length) ?
                    <div></div>
                    :
                    <div >
                        <button
                            style={{
                                padding: "20px 20px 20px 20px",
                                margin:"50px 100px 100px 50px",
                                fontWeight: "bolder",
                                borderRadius: "10px",
                                backgroundColor: "blue",
                                borderColor:"blue",
                                color: "white"
                            }}
                            onClick={this.showMoreHandler}
                        
                        >
                            View More
                        </button>

                    </div>
                }
            </div>
            
        )
    };
};

export default NewsFeed;