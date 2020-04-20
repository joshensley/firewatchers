import React, { Component } from 'react';
import firebase from '../../../config/Firebase';
import axios from '../../../axios';
import { Redirect } from 'react-router-dom';
import classes from './SignUp.module.css';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        errorSignUp: '',
        firstName: '',
        lastName: '',
        signedUp: false
        
    }

    signUp = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((data) => { 
                const { user } = data;
               
                if (user) {
                    const displayName = this.state.firstName + " " + this.state.lastName
                    user.updateProfile({
                        displayName: displayName
                    })

                    const newUserInformation = {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        profilePicture: "https://firebasestorage.googleapis.com/v0/b/firewatchers.appspot.com/o/defaultProfilePicture%2Fblank-profile-picture-973460_640.png?alt=media&token=c75cbb4f-76a1-422a-bc5d-166c5edcd19a",
                        friends: {
                            friendsList: {dumbValue: ""},
                            friendsRequests: {dumbValue: ""},
                            userRequestedFriends: {dumbValue: ""},
                        }
                    }

                    axios.post('/userInformation/' + user.uid + '.json', newUserInformation)
                }
                this.setState({signedUp: true});

            }).catch((error) => {
                console.log(error);
                this.setState({errorSignUp: "Email Address already exists!"})
        })
        
    }

    handleChange = (e) => {
        this.setState({ 
            [e.target.name]: e.target.value,
        });
    }

    render() {

        if (this.state.signedUp === true) {
            return (
                <Redirect to={{ pathname: "/" }} />
            );
            
        }

        return (
            <div style={{color: "white"}}>
                <h1>Sign Up</h1>
                
                <form>
                    <div>

                        <div>
                            <input
                                className={classes.InputStatus}
                                value={this.state.firstName} 
                                onChange={this.handleChange} 
                                type="firstName" 
                                name="firstName" 
                                placeholder="First Name"
                            />
                        </div>
                    </div>
                    <div>
                        
                        <div>
                            <input 
                                className={classes.InputStatus}
                                value={this.state.lastName} 
                                onChange={this.handleChange} 
                                type="lastName" 
                                name="lastName"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>
                    <div>
                       
                        <div>
                            <input 
                                className={classes.InputStatus}
                                value={this.state.email} 
                                onChange={this.handleChange} 
                                type="email" 
                                name="email" 
                                placeholder="Email Address"
                            />
                        </div>
                    </div>
                    <div>
                       
                        <div>
                            <input 
                                className={classes.InputStatus}
                                value={this.state.password} 
                                onChange={this.handleChange} 
                                type="password" 
                                name="password" 
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    <button
                        style={{
                            backgroundColor: "black",
                            borderColor: "black",
                            color: "white",
                            padding: "10px 10px 10px 10px",
                            fontSize: "large"
                        }}
                        type="submit" 
                        onClick={this.signUp}
                    >
                        Sign Up
                    </button>
                    <br/>
                    {this.state.errorSignUp ? this.state.errorSignUp : ""}
                </form>
                
            </div>
        )
    }
}

export default SignUp;