import React, { Component } from 'react';
import axios from '../../../../axios';

import UserStatusUpdateCard from './UserStatusUpdateCard/UserStatusUpdateCard';


class UserStatusUpdate extends Component {

    state = {
        userStatusUpdate: "",
        postDate: "",
        profilePicture: "",
        userStatus: "",
        displayUserStatusData: 5,
    }

    getData = () => {
        const userId = localStorage.getItem('user');

        let fetchedUserStatus = [];
        axios.get('/userStatusUpdate/' + userId + '.json')
            .then(response => {
                for (let key in response.data) {
                    fetchedUserStatus.push({
                        ...response.data[key],
                        id: key
                    })
                }
                
                fetchedUserStatus.sort((a, b) => new Date(b.date) - new Date(a.date));
                this.setState({ userStatus: fetchedUserStatus})
            })
    }

    componentDidMount() {
        this.getData()

        axios.get('/userInformation/' + localStorage.getItem('user') + '.json')
            .then(response => {
                for (let key in response.data) {
                    //console.log(response.data[key].profilePicture)
                    let profilePicture = response.data[key].profilePicture
                    this.setState({ profilePicture });
                }
            })
    }

    onChangeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitButton = () => {
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

    showMoreHandler = () => {
        this.setState((prevState) => ({
            displayUserStatusData: prevState.displayUserStatusData + 5
        }))
    }

    render() {
        
        let insertStatusUpdates = "";
        if (this.state.userStatus) {
            const displayName = localStorage.getItem('userDisplayFirstName')
            insertStatusUpdates = this.state.userStatus
                .slice(0, this.state.displayUserStatusData)
                .map(item => (
                    <div key={item.id}>
                        <UserStatusUpdateCard userStatus={item} displayName={displayName} profilePicture={this.state.profilePicture} />
                    </div>
                )
            )
        }
    

        return (
            <div>
                <div style={{backgroundColor: "black", margin: "-30px 0px 0px 0px"}}>
                    <span>
                    <img 
                        style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            objectGit: "cover", 
                            // padding: "20px 0px 0px 0px",
                            // margin: "10px 10px 10px 10px"
                        }}
                        src={this.state.profilePicture}
                        alt="Uploaded Images"
                    />
                    </span>
                    <h1 style={{color: "white", padding: "0px 0px 20px 0px"}}>{localStorage.getItem('userDisplayFirstName')}</h1>
                </div>
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
                    placeholder="Enter Status..."
                    type="text"
                    name="userStatusUpdate"
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
                <div>
                    {insertStatusUpdates}

                    {
                        (this.state.displayUserStatusData >= this.state.userStatus.length) ?
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
                    
            </div>
        )
    }
}

export default UserStatusUpdate;