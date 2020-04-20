import React, { Component } from 'react';
import axios from '../../../../../axios';
import classes from './UserStatusUpdateCard.module.css';
import CommentHistory from './CommentHistory';

class UserStatusUpdateCard extends Component {

    state = {
        userStatusHeight: 0,
        titleBarHeight: 0,
        commentHeight: 0,
        likeHeight: 0,
        commentHistoryHeight: 0,
        userLikeStatus: 'Like',
        userNameLikeList: [],
        comment: "",
        userId: "",
        commentHistory: [],
        isExpanded: false,
    }

    getData = () => {

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
        for ( let key in liked) {
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
            userStatusHeight: this.userStatusElement.clientHeight, 
            titleBarHeight: this.titleBarElement.clientHeight,
            commentHeight: this.commentElement.clientHeight,
            userNameLikeList: userNameLikeList, 
            userId: this.props.userStatus.id, 
            commentHistory
        })   
    }

    componentDidMount() {
        this.getData() 
    }

    likeHandler = (e) => {
        
        let statusId = e.target.value;
        let userId = localStorage.getItem('user')

        switch(e.target.name) { 
            case 'Liked':
                axios.get(`/userStatusUpdate/${userId}/${statusId}/liked.json`)
                    .then(response => {
                        for ( let key in response.data ) {
                            let likedKey = response.data[key].userId
                            if ( likedKey === userId ) {

                                // removes the user like
                                axios.delete(`/userStatusUpdate/${userId}/${statusId}/liked/${key}.json`)
                                    .then(response => {

                                        // refreshes the user like list
                                        axios.get(`/userStatusUpdate/${userId}/${statusId}/liked.json`)
                                            .then(response => {
                                                let newUserLikes = [];
                                                for (let key in response.data) {
                                                    if ( response.data[key] !== "null") {
                                                        newUserLikes.push(response.data[key])
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
                let postLike = {liked: this.props.displayName, userId: userId}

                axios.post(`/userStatusUpdate/${userId}/${statusId}/liked.json`, postLike)
                    .then(response => {
                        let newUserLikes = [...this.state.userNameLikeList, this.props.displayName]
                        this.setState({
                            userLikeStatus: "Liked", 
                            userNameLikeList: newUserLikes
                        })                        
                    })
                break;
        }
    }

    commentHandler = (e) => (
        this.setState({comment: e.target.value})
    )

    enterCommmentHandler = (e) => {

        if (this.state.comment !== "") {

            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + 
            ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            let comment = {
                comment: this.state.comment,
                userId: localStorage.getItem('user'),
                date: date
            }
            axios.post(`/userStatusUpdate/${localStorage.getItem('user')}/${e.target.name}/comment.json`, comment)
                .then(response => this.setState({comment: ""}))
                .then(response => {
                    axios.get(`/userInformation/${localStorage.getItem('user')}.json`)
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

        this.setState( (prevState) => ({
            isExpanded: !prevState.isExpanded
        }))
    }

    render() {

        const {isExpanded} = this.state;

        // Determines the height of the container for user status update
        let determineHeight = this.state.userStatusHeight + this.state.titleBarHeight + 
                                this.state.commentHeight + this.state.likeHeight + 
                                this.state.commentHistoryHeight + 90
        let pixelHeight =  determineHeight + "px"

        // Determines the date
        let myDate = new Date(this.props.userStatus.date)
        let month = myDate.toLocaleString('default', {month: 'long'});
        let day = myDate.getDate()
        let year = myDate.getFullYear()
        let time = myDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})
        let fullDate = `${month} ${day}, ${year} at ${time}`;

        return (      
            <div 
                key={this.props.userStatus.id} 
                className={classes.MainCard}
                style={{height: pixelHeight}}
            >
                <div className={classes.TopLeft}>
                    <span>
                        <img 
                            ref={(titleBarElement) => { this.titleBarElement = titleBarElement }}
                            className={classes.Img} 
                            src={this.props.profilePicture} 
                            alt="profile"
                        />
                    </span>
                    <span>
                        <p className={classes.Name}>
                            {this.props.displayName}
                        </p>
                        <p className={classes.Date}>
                            {fullDate}
                        </p>
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
                        {
                            this.state.userNameLikeList[0] === undefined ?
                            ""
                            :
                            this.state.userNameLikeList[0] + " liked this post"   
                        }
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
                                value={this.props.userStatus.id}
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
                        {
                            isExpanded ?
                            <div ref="CommentHistory">
                                <CommentHistory comments={this.state.commentHistory} />
                            </div>
                            :
                            <div ref="CommentHistory" onClick={(e) => this.onClickHandler(e)}></div>
                             
                            
                        }
                    </div>
                </div> 
            </div>
        )

    }

    
}

export default UserStatusUpdateCard;