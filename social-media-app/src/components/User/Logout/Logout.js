import React, { Component } from 'react';
import firebase from '../../../config/Firebase';
import { Redirect } from 'react-router-dom';

class Logout extends Component {

    state = {
        loggedOut: false
    }

    logout = () => {
        firebase.auth().signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('userDisplayFirstName');
        localStorage.removeItem('userProfilePicture');
        this.setState({ loggedOut: true});
    }

    render() {

        if (this.state.loggedOut) {
            return (
                <Redirect to={{ pathname: "/" }}/>
            )
        }


        return (
            <div>
                <button 
                    onClick={this.logout}
                    style={{
                        backgroundColor: "black",
                        borderColor: "black",
                        color: "white",
                        padding: "20px 20px 20px 20px",
                        fontSize: "large"
                    }}
                >
                    Logout
                </button>
            </div>
        )
    }
}

export default Logout;