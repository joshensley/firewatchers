import React, { Component } from 'react';
import axios from '../../../axios';
import FriendRequest from '../FriendRequest/FriendRequest';
import classes from './Friends.module.css';

class Friends extends Component {

    state = {
        userInformation: [],
        currentUserFirebaseKey: "",
        currentUserFriends: "",
        friendsFilterState: "allUsers",
        loading: true
    }

    getData = (value=this.state.friendsFilterState) => {
        axios.get('/userInformation.json')
            .then(response => {
                let userInformation = [];
                for (let key in response.data) {

                    let firebaseKey = Object.keys(response.data[key]);
                    if (key === localStorage.getItem('user')) {
                        const currentUserFriends = response.data[key][firebaseKey].friends

                        this.setState({
                            currentUserFirebaseKey: firebaseKey, 
                            currentUserFriends: currentUserFriends
                        })
                    }

                    if (key !== localStorage.getItem('user')) {
                        userInformation.push({
                            ...response.data[key][firebaseKey],
                            friendFirebaseKey: firebaseKey,
                            id: key
                        })
                        
                    }
            
                }

                switch (value) {
                    case 'requestedFriends':
                        const userKeysRequestedFriends = Object.keys(this.state.currentUserFriends.userRequestedFriends)
                        const filteredUserInformationRequestedFriends = userInformation.filter(item => {
                            for (let key in userKeysRequestedFriends) {
                                let userFriendKey = userKeysRequestedFriends[key];
                                if (this.state.currentUserFriends.userRequestedFriends[userFriendKey].friendId === item.id) {
                                    return {item}
                                }  
                            }
                            return null
                        })
                        this.setState({ 
                            userInformation: filteredUserInformationRequestedFriends, loading: false})
                        break;

                    case 'friendRequests':
                        const userKeysFriendRequests = Object.keys(this.state.currentUserFriends.friendsRequests)
                        const filteredUserInformationFriendRequests = userInformation.filter(item => {
                            for (let key in userKeysFriendRequests) {
                                let userFriendKey = userKeysFriendRequests[key];
                                if (this.state.currentUserFriends.friendsRequests[userFriendKey].requestorId === item.id) {
                                    return {item}
                                }  
                            }
                            return null
                        })
                        this.setState({ userInformation: filteredUserInformationFriendRequests, loading: false })  
                        break;

                    case 'friends':
                        const userKeys = Object.keys(this.state.currentUserFriends.friendsList)
                        const filteredUserInformation = userInformation.filter(item => {
                            for (let key in userKeys) {
                                let userFriendKey = userKeys[key];
                                if (this.state.currentUserFriends.friendsList[userFriendKey].friendId === item.id) {
                                    return {item}
                                }  
                            }
                            return null
                        })
                        this.setState({ userInformation: filteredUserInformation, loading: false })
                        break;

                    default:
                        this.setState({ userInformation, loading: false })
                        break;
                }
                
            })
    }

    componentDidMount() {
        this.getData(this.state.friendsFilterState);
    }

    friendFilterStateHandler = (e) => {
        this.setState({friendsFilterState: e.target.value})
        this.getData(e.target.value)

        
    }

    render() {
        
        let friendsListLength = "";
        let friendsRequests = "";
        let requestedFriends = "";
        if (this.state.loading === false) {
            friendsListLength = Object.keys(this.state.currentUserFriends.friendsList).length - 1
            friendsRequests = Object.keys(this.state.currentUserFriends.friendsRequests).length - 1
            requestedFriends = Object.keys(this.state.currentUserFriends.userRequestedFriends).length - 1

        }

        
    
        return (
           
            <div style={{color: "white"}}>
                <div>
                    <button 
                        style={
                            this.state.friendsFilterState === 'allUsers' ? 
                            {backgroundColor: "black", borderColor: "black"} : 
                            {backgroundColor: "gray", borderColor: "gray"}
                        }
                        className={classes.LeftTopButtonBar}
                        onClick={this.friendFilterStateHandler}
                        name="allUsers"
                        value="allUsers"
                    >
                        All Users
                    </button>
                    <button
                        style={
                            this.state.friendsFilterState === 'requestedFriends' ? 
                            {backgroundColor: "black", borderColor: "black"} : 
                            {backgroundColor: "gray", borderColor: "gray"}
                        }
                        className={classes.TopButtonBar}
                        onClick={this.friendFilterStateHandler}
                        name="requestedFriends"
                        value="requestedFriends"
                    >
                        Requested Friends ({requestedFriends})
                    </button>
                    <button
                        style={
                            this.state.friendsFilterState === 'friendRequests' ? 
                            {backgroundColor: "black", borderColor: "black"} : 
                            {backgroundColor: "gray", borderColor: "gray"}
                        }
                        className={classes.TopButtonBar}
                        onClick={this.friendFilterStateHandler}
                        name="friendRequests"
                        value="friendRequests"
                    >
                        Friend Requests ({friendsRequests})
                    </button>
                    <button
                        style={
                            this.state.friendsFilterState === 'friends' ? 
                            {backgroundColor: "black", borderColor: "black"} : 
                            {backgroundColor: "gray", borderColor: "gray"}
                        }
                        className={classes.RightTopButtonBar}
                        onClick={this.friendFilterStateHandler}
                        name="friends"
                        value="friends"
                    >
                        Friends ({friendsListLength})
                    </button>
                </div>
                <div className={classes.Container}>
                {   
                    this.state.userInformation.map(item => {
                        return (
                            
                            <div className={classes.ProfileCard} key={item.id}>
                                <div>
                                    <img 
                                        className={classes.Img}
                                        src={item.profilePicture} 
                                        alt="profile" 
                                    />
                                    <div>
                                        {item.firstName} {item.lastName}
                                        
                                    </div>
                                    <div>
                                        <FriendRequest
                                            friendId={item.id}
                                            friendFirebaseKey={item.friendFirebaseKey}
                                            currentUserFriends={this.state.currentUserFriends}
                                            currentUserFirebaseKey={this.state.currentUserFirebaseKey}
                                            getData={this.getData}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                        )
                    })
                    
                }
                </div>
            </div>
        )
    }
}

export default Friends;