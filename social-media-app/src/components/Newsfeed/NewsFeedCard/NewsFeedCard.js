import React, { Component } from 'react';
import classes from './NewsFeedCard.module.css';
import axios from '../../../axios';

import CommentHistoryNewsCard from './CommentHistoryNewsCard';

class NewsFeedCard extends Component {

    state = {
        titleBarHeight: 0,
        userStatusHeight: 0,
        likeHeight: 0,
        commentHeight: 0,
        commentHistoryHeight: 0,
        userNameLikeList: [],
        likeHandleData: this.props.userStatus.id + " " + this.props.userStatus.friendId2,
        userLikeStatus: "Like",
        comment: "",
        userId: this.props.userStatus.id,
        commentHistory: [],
        isExpanded: false,
        
    }

    componentDidMount() {

        // Removes duplicate userIds
        function removeDuplicates(array) {
            return array.filter((a, b) => array.indexOf(a) === b)
        }

        let commentHistory = [];
        let commentsArray = [];
        let comments = this.props.userStatus.comment;
        for (let key in comments) {
            if (comments[key] !== "null") {
                let comment = comments[key].userId
                commentsArray.push(comment)
                commentHistory.push(comments[key]);
            }
        }

        const newArray = removeDuplicates(commentsArray);

        // Requests the current userId information
        let commentsToState = [];
        let userInformation = [];
        for ( let id in newArray ) {
            let user = newArray[id];
            axios.get(`/userInformation/${user}.json`)
                // Gets user information from firebase
                .then(response => {
                    let key = Object.keys(response.data)[0]
                    userInformation.push({...response.data[key], id: user})
                })
                // Merges the comments with corrosponding user information
                .then(response => {
                    for (let key in userInformation) {
                        let singleUserInformation = userInformation[key];
                        for (let commentKey in commentHistory) {
                            let singleComment = commentHistory[commentKey];

                            switch (singleUserInformation.id) {
                                case singleComment.userId:
                                    commentsToState.push({
                                        ...singleComment, 
                                        ...singleUserInformation
                                    })
                                    break;
                                default:
                                    break;
                            } 
                        }
                    }
                    this.setState({commentHistory: commentsToState})
                })
        }

        let userNameLikeList = [];
        let liked = this.props.userStatus.liked;
        for( let key in liked ) {
            let userId = liked[key].userId

            if (localStorage.getItem('user') === userId) {
                this.setState({userLikeStatus: "Liked"})
            }

            let userName = liked[key].liked
            if (userName !== undefined) {
                userNameLikeList.push(userName)
            }
        }

        this.setState({
            titleBarHeight: this.titleBarElement.clientHeight,
            userStatusHeight: this.userStatusElement.clientHeight,
            likeHeight: this.likeHeight.clientHeight,
            commentHeight: this.commentElement.clientHeight,
            userNameLikeList: userNameLikeList,
            
        })
    }

    likeHandler = (e) => {
         
        let statusId = e.target.value.split(" ")[0]
        let friendId = e.target.value.split(" ")[1]

        const displayName = localStorage.getItem('userDisplayFirstName')
        const userId = localStorage.getItem('user');

        switch(e.target.name) {
            case 'Liked':
                // gets the liked list from firebase
                axios.get(`/userStatusUpdate/${friendId}/${statusId}/liked.json`)
                    .then(response => {
                        for (let key in response.data) {
                            let likedKey = response.data[key].userId;

                            // deletes like
                            if (likedKey === userId) {
                                axios.delete(`/userStatusUpdate/${friendId}/${statusId}/liked/${key}.json`)
                                    .then(response => {

                                        // sets the new like list
                                        axios.get(`/userStatusUpdate/${friendId}/${statusId}/liked.json`)
                                            .then(response => {        
                                                let newUserLikes = [];
                                                for (let key in response.data) {
                                                    if (response.data[key] !== "null") {
                                                        newUserLikes.push(response.data[key].liked)
                                                    }
                                                }
                                                this.setState({userNameLikeList: newUserLikes})

                                            })  
                                        
                                    })
                                this.setState({userLikeStatus: "Like"})
                            }
                        }
                    })
                break;
            default:
                
                // posts the new user like
                let postLike = {liked: displayName, userId: userId}
                axios.post(`/userStatusUpdate/${friendId}/${statusId}/liked.json`, postLike)
                    .then(response => {
                        let newUserLikes = [...this.state.userNameLikeList, displayName]
                        this.setState({
                            userLikeStatus: "Liked",
                            userNameLikeList: newUserLikes
                        })
                    })
                break;
        }
    }

    commentHandler = (e) => {
        this.setState({comment: e.target.value});
    }

    enterCommmentHandler = (e) => {

        let friendId = this.props.userStatus.friendId2
        
        
        if (this.state.comment !== "") {

            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + 
            ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            let comment = {
                comment: this.state.comment,
                userId: localStorage.getItem('user'),
                date: date
            }

            axios.post(`/userStatusUpdate/${friendId}/${e.target.name}/comment.json`, comment)
                .then(response => this.setState({comment: ""}))
                .then(response => {
                    axios.get(`userInformation/${localStorage.getItem('user')}.json`)
                        .then(response => {
                            const key = Object.keys(response.data)
                            const newComment = {...response.data[key], ...comment}

                            this.setState({
                                commentHistory: [...this.state.commentHistory, newComment]
                            })

                            setTimeout(() => {
                                this.setState({
                                    commentHistoryHeight: this.refs.CommentHistory.clientHeight
                                })
                            }, 1)

                            if (this.state.isExpanded === false) {
                                this.setState({isExpanded: true})
                            }

                    })
                    
                })
        }
    }

    onClickHandler = (e) => {
        e.preventDefault()

        setTimeout(() => {
            this.setState({
                commentHistoryHeight: this.refs.CommentHistory.clientHeight
            })
        }, 1)

        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded
        }))
    }


    render() {



        let { isExpanded } = this.state;

        // Determines the height of the container for user status update
        let determineHeight = this.state.userStatusHeight + this.state.titleBarHeight + 
                                this.state.likeHeight + this.state.commentHeight + 
                                this.state.commentHistoryHeight + 90
        let pixelHeight = determineHeight + "px"
        
        // Displays the user likes
        const lengthOfUserNameLikeList = this.state.userNameLikeList.length
        let displayfriendLikes = "";
        if (lengthOfUserNameLikeList === 1) {
            displayfriendLikes = this.state.userNameLikeList[0] + " liked this post.";
        } else if (lengthOfUserNameLikeList === 2) {
            displayfriendLikes = this.state.userNameLikeList[0] + " and " + this.state.userNameLikeList[1] + " liked this post."
        } else if (lengthOfUserNameLikeList === 3) {
            displayfriendLikes = this.state.userNameLikeList[0] + ", " + this.state.userNameLikeList[1] + " and " + this.state.userNameLikeList[2] + " liked this post."
        } else if (lengthOfUserNameLikeList >= 4) {
            displayfriendLikes = this.state.userNameLikeList[0] + " and " + (lengthOfUserNameLikeList - 1) + " friends liked this post."
        }

        // Determines the date
        let myDate = new Date(this.props.userStatus.date)
        let month = myDate.toLocaleString('default', {month: 'long'});
        let day = myDate.getDate()
        let year = myDate.getFullYear()
        let time = myDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})
        let fullDate = `${month} ${day}, ${year} at ${time}`;


        return (
            <div className={classes.MainCard} style={{height: pixelHeight}}>

                 <div className={classes.TopLeft}>
                    <span>
                        <img
                            ref={(titleBarElement) => {this.titleBarElement = titleBarElement}}
                            className={classes.Img}
                            src={this.props.userStatus.profilePicture} 
                            alt="profile" 
                             
                        />
                    </span>
                    <span>
                        <p className={classes.Name}>{this.props.userStatus.firstName} {this.props.userStatus.lastName}</p>
                    </span>
                    <span>
                        <p className={classes.Date}>{fullDate}</p>
                    </span>
                </div>
                
                <div className={classes.Example}>
                    <div
                        className={classes.Center}
                        ref={(userStatusElement) => { this.userStatusElement = userStatusElement }}
                    >
                        <p>{this.props.userStatus.statusUpdate}</p>
                    </div>

                    <div
                        style={{fontSize: "x-small", textAlign: "left"}}
                        ref={(likeHeight) => {this.likeHeight = likeHeight}}
                    >
                        {displayfriendLikes}
                    </div>

                    <div ref={(commentElement) => { this.commentElement = commentElement }}>
                        <hr style={{width: "90%", padding: "0px"}}></hr>
                            <input 
                                    className={classes.InputStatus}
                                    type="text" 
                                    placeholder="Comment..."
                                    onChange={this.commentHandler}
                                    name={this.state.userId}
                                    value={this.state.comment}
                            />
                            <button 
                                onClick={this.enterCommmentHandler}
                                name={this.state.userId}
                                className={classes.LikeCommentButton}
                            >
                                Comment
                            </button>
                        
                            <button
                                className={classes.LikeCommentButton}
                                onClick={this.likeHandler}
                                name={this.state.userLikeStatus}
                                value={this.state.likeHandleData}
                            >
                                {this.state.userLikeStatus}
                            </button>
                        
                        <hr style={{width: "90%", padding: "0px"}}></hr>
                    </div>

                    <div>
                        <div
                            onClick={(e) => this.onClickHandler(e)}
                            className={classes.ViewComments}
                        >
                            <h4>
                                {
                                    isExpanded ?
                                    `Collapse Comments (${this.state.commentHistory.length})` 
                                    : 
                                    `View Comments (${this.state.commentHistory.length})`
                                }
                            </h4>
                    </div>
                       

                        <div>
                            {
                                isExpanded ?
                                <div ref="CommentHistory">
                                    <CommentHistoryNewsCard comments={this.state.commentHistory} />
                                </div>
                                :
                                <div ref="CommentHistory" onClick={(e) => this.onClickHandler(e)}></div>

                            }
                            

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default NewsFeedCard;