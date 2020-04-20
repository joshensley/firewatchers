import React, { Component } from 'react';
import axios from '../../../axios';
import firebase from "../../../config/Firebase";
import classes from './EditUserInfo.module.css';

class EditUserInfo extends Component {

    state = {
        image: null,
        url: "",
        firstName: "",
        lastName: "",
        email: "",
        friends: [],
        profilePicture: "",
        userKey: ""
    }

    componentDidMount() {
        let userInformation = [];
        const userId = localStorage.getItem('user')
        axios.get('/userInformation/' + userId + '.json')
            .then(response => {
                for (let key in response.data) {
                    userInformation.push({
                        ...response.data[key],
                        id: key
                    })
                    this.setState({userKey: key})
                }

                let firstName = userInformation[0].firstName
                let lastName = userInformation[0].lastName
                let email = userInformation[0].email
                let friends = userInformation[0].friends
                let profilePicture = userInformation[0].profilePicture

                this.setState({firstName, lastName, email, friends, profilePicture})
            })
        
    }

    editUserInfoHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    changeImgFileHandler = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    submitHandler = (e) => {
        e.preventDefault()

        // Image upload
        const { image } = this.state;

        if (image === null) {
            // Username upload
            const userId = localStorage.getItem('user');
            const userKey = this.state.userKey;

            let newUserInfo = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                friends: this.state.friends,
                profilePicture: this.state.profilePicture
            }
            axios.put('/userInformation/' + userId + '/' + userKey + '.json', newUserInfo)
                //.then(response => console.log(response.data))

        } else {
            //const uploadTask = storage.ref(`profilePictures/${userId}/${image.name}`).put(image);
            const uploadTask = firebase.storage().ref(`profilePictures/${image.name}`).put(image);
        
            uploadTask.on(
                "state_changed",
                // error => {
                //     console.log(error);
                // },
                () => {
                    firebase.storage()
                        .ref("profilePictures")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            
                            this.setState({ url });

                            // Username upload
                            const userId = localStorage.getItem('user');
                            const userKey = this.state.userKey;

                            let newUserInfo = {
                                firstName: this.state.firstName,
                                lastName: this.state.lastName,
                                email: this.state.email,
                                friends: this.state.friends,
                                profilePicture: this.state.url
                            }
                            
                            axios.put('/userInformation/' + userId + '/' + userKey + '.json', newUserInfo)
                                .then(response => {
                                    alert("User Profile Updated")
                                    window.location.reload()
                                })
                        })
                }
            )
        }
    }

    render() {
        
        return (
            <div className={classes.BackgroundContainer} style={{color:"white"}}>
               
                <img 
                    className={classes.Img} 
                    src={this.state.profilePicture} 
                    // height="auto" 
                    // width="200px" 
                    alt="profile" 
                />
                <br></br>
                <form>
                    <div>
                        <div className={classes.Name}>First Name:</div>
                        
                        <input
                            className={classes.InputBox}
                            type="text"
                            value={this.state.firstName}
                            name="firstName"
                            onChange={this.editUserInfoHandler}
                        />
                    </div>
                    <br></br>
                    <div>
                        <div className={classes.Name}>Last Name:</div>
                        
                        <input
                            className={classes.InputBox}
                            type="text" 
                            value={this.state.lastName} 
                            name="lastName"
                            onChange={this.editUserInfoHandler}
                        />
                    </div>
                    <br></br>
                    <div className={classes.FileInput}> 
                        <input
                            type="file"
                            onChange={this.changeImgFileHandler} 
                        />
                        <button
                            className={classes.Button}
                        >
                            Update Picture
                        </button>
                    </div>
                    <br></br>
                    <button className={classes.Button} onClick={this.submitHandler}>
                        Submit
                    </button>
                </form>
                

            </div>
        )
    }
}

export default EditUserInfo;