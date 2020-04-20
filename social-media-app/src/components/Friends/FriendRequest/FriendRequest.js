import React, { Component } from 'react';
import axios from '../../../axios';
import classes from './FriendRequest.module.css';


class FriendRequest extends Component {

    friendRequestButtonHandler = () => {
        const friendId = this.props.friendId;
        const friendFirebaseKey = this.props.friendFirebaseKey;
        const currentUserId = localStorage.getItem('user');
        const currentUserFirebaseKey = this.props.currentUserFirebaseKey;

        let addNewFriendRequester = { friendId: friendId };
        axios.post('/userInformation/' + currentUserId + '/' + currentUserFirebaseKey + 
                    '/friends/userRequestedFriends.json', addNewFriendRequester)
                    ;

        let addNewFriendRequest = { requestorId: currentUserId }
        axios.post('/userInformation/' + friendId + '/' + friendFirebaseKey + 
                    '/friends/friendsRequests.json', addNewFriendRequest)
                    .then( response => this.props.getData() )
                    ;

        
    }

    removeFriendRequestButtonHandler = () => {
        const friendId = this.props.friendId;
        const friendFirebaseKey = this.props.friendFirebaseKey;
        const currentUserId = localStorage.getItem('user');
        const currentUserFirebaseKey = this.props.currentUserFirebaseKey;

        let data = [];
        axios.get('/userInformation/' + currentUserId + '/' + 
            currentUserFirebaseKey + '/friends/userRequestedFriends.json')
            .then(response => {
                for (let key in response.data) {
                    data.push({
                        ...response.data[key],
                        id: key
                    })
                }

                for (let newKey in data) {
                    let loopFriendId = data[newKey].friendId
                    let loopId = data[newKey].id

                    if (loopFriendId === friendId) {
                        axios.delete('/userInformation/' + currentUserId + 
                            '/' + currentUserFirebaseKey + '/friends/userRequestedFriends/' 
                            + loopId + '.json')
                    } 
                }
            })
        
        let newData = [];
        axios.get('/userInformation/' + friendId + '/' + 
            friendFirebaseKey + '/friends/friendsRequests.json')
            .then(response => {
                for (let key in response.data) {
                    newData.push({
                        ...response.data[key],
                        id: key
                    })
                }

                for (let newKey in newData) {
                    let loopCurrentUserId = newData[newKey].requestorId;
                    let loopId = newData[newKey].id

                    if (loopCurrentUserId === currentUserId) {
                        axios.delete('/userInformation/' + friendId + '/' + 
                            friendFirebaseKey[0] + '/friends/friendsRequests/' + 
                            loopId + '.json')
                            .then( response => this.props.getData() )
                            
                    }
                }
            })
        
        
    }

    acceptFriendRequestButtonHandler = () => {
        const friendId = this.props.friendId;
        const friendFirebaseKey = this.props.friendFirebaseKey;
        const currentUserId = localStorage.getItem('user');
        const currentUserFirebaseKey = this.props.currentUserFirebaseKey;

        let data = [];
        axios.get('/userInformation/' + currentUserId + '/' + 
            currentUserFirebaseKey + '/friends/friendsRequests.json')
            .then(response => {
                for (let key in response.data) {
                    data.push({
                        ...response.data[key],
                        id: key
                    })
                }

                for (let newKey in data) {
                    let loopFriendId = data[newKey].requestorId
                    let loopId = data[newKey].id

                    if (loopFriendId === friendId) {
                        let addNewFriend = {friendId: friendId}

                        axios.post('/userInformation/' + currentUserId + '/' + 
                            currentUserFirebaseKey + '/friends/friendsList.json', addNewFriend)
                        
                        axios.delete('/userInformation/' + currentUserId + 
                            '/' + currentUserFirebaseKey + '/friends/friendsRequests/' 
                            + loopId + '.json')
                    } 
                }
            })

        let newData = [];
        axios.get('/userInformation/' + friendId + '/' + 
            friendFirebaseKey + '/friends/userRequestedFriends.json')
            .then(response => {
                for (let key in response.data) {
                    newData.push({
                        ...response.data[key],
                        id: key
                    })
                }
    
                for (let newKey in newData) {                    
                    let loopCurrentUserId = newData[newKey].friendId;
                    let loopId = newData[newKey].id

                    if (loopCurrentUserId === currentUserId) {
                        let addNewFriend = { friendId: currentUserId}

                        axios.post('/userInformation/' + friendId + '/' + 
                        friendFirebaseKey + '/friends/friendsList.json', addNewFriend)

                        axios.delete('/userInformation/' + friendId + '/' + 
                            friendFirebaseKey[0] + '/friends/userRequestedFriends/' + 
                            loopId + '.json')
                            .then( response => this.props.getData() )
                            
                    }
                }
            })
        
    }

    unfriendButtonHandler = () => {
        const friendId = this.props.friendId;
        const friendFirebaseKey = this.props.friendFirebaseKey;
        const currentUserId = localStorage.getItem('user');
        const currentUserFirebaseKey = this.props.currentUserFirebaseKey;

        let data = [];
        axios.get('/userInformation/' + friendId + '/' + friendFirebaseKey + '/friends/friendsList.json')
            .then(response => {
                for (let key in response.data) {
                    data.push({
                        ...response.data[key],
                        id: key
                    })
                }

                for (let newKey in data) {
                    let loopFriendListId = data[newKey].friendId;
                    let loopId = data[newKey].id

                    if (loopFriendListId === currentUserId) {

                        axios.delete('userInformation/' + friendId + '/' + friendFirebaseKey +
                             '/friends/friendsList/' + loopId + '.json')
                    }

                }
            })

        let newData = [];
        axios.get('userInformation/' + currentUserId + '/' + currentUserFirebaseKey + '/friends/friendsList.json')
            .then(response => {
                for (let key in response.data) {
                    newData.push({
                        ...response.data[key],
                        id: key
                    })
                }

                for (let newKey in newData) {
                    let loopFriendListId = newData[newKey].friendId;
                    let loopId = newData[newKey].id;

                    if (loopFriendListId === friendId) {

                        axios.delete('userInformation/' + currentUserId + '/' + currentUserFirebaseKey
                            + '/friends/friendsList/' + loopId + '.json')
                            .then(response => this.props.getData())
                    }
                }
            })
    }

    render() {
        
        const friendId = this.props.friendId;
        const userRequestedFriendsKeys = Object.keys(this.props.currentUserFriends.userRequestedFriends)
        const userAcceptRequestFriendsKeys = Object.keys(this.props.currentUserFriends.friendsRequests);
        const userFriendsKeys = Object.keys(this.props.currentUserFriends.friendsList);

        let requestButton = (
                <button
                    className={classes.AddFriend}
                    onClick={this.friendRequestButtonHandler}
                >
                    Add Friend
                </button>
        );
       

        for (let key in userRequestedFriendsKeys) {

            let newKey = userRequestedFriendsKeys[key];
            let requestedFriend = this.props.currentUserFriends.userRequestedFriends[newKey].friendId

            
            if (friendId === requestedFriend) {
                requestButton = (
                    <div>
                        <button 
                            className={classes.FriendRequest}
                            onClick={this.removeFriendRequestButtonHandler}
                        >
                            Requested
                        </button>
                    </div>
                );
                break;
            }
 
        }

        for (let key in userAcceptRequestFriendsKeys) {

            let newKey = userAcceptRequestFriendsKeys[key];
            let acceptFriendRequest = this.props.currentUserFriends.friendsRequests[newKey].requestorId

            if (friendId === acceptFriendRequest) {
                requestButton = (
                    <div>
                        <button 
                            className={classes.Accept}
                            onClick={this.acceptFriendRequestButtonHandler}
                        >
                            Accept
                        </button>
                    </div>
                );
                break;

            }
        }

        for (let key in userFriendsKeys) {
            let newKey = userFriendsKeys[key];
            let friends = this.props.currentUserFriends.friendsList[newKey].friendId;

            if (friendId === friends) {
                requestButton = (
                    <div>
                        <button 
                            className={classes.Unfriend}
                            onClick={this.unfriendButtonHandler}
                        >
                            Unfriend
                        </button>
                    </div>
                );
                break;
            }
        }

        return (
            <div>
                {requestButton}
            </div>
        )
    }
}

export default FriendRequest;