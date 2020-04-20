import React, { Component } from 'react';
import firebase from '../../../config/Firebase';
import { Redirect } from 'react-router-dom';
import auth from '../../../auth/auth';
import classes from './Login.module.css';

class Login extends Component {

    state = {
        email: '',
        password: '',
        errorLogin: ''
    }

    login = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((error) => {
                console.log(error);
                this.setState({errorLogin: "Email Address or password in invalid!"})
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        if (localStorage.getItem('user')) {
            auth.login()
            return (
                <Redirect to={{ pathname: "/main/" + localStorage.getItem('user')}}/>
                ) 
          }

        

        return (
            <div style={{color:"white"}}>
                <h1>Login</h1>
                <form>
                    <div>
                        <input
                            className={classes.InputStatus} 
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            type="email" 
                            name="email" 
                            placeholder="Enter email"
                        />
                    </div>
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
                    
                    <button
                        style={{
                            backgroundColor: "black",
                            borderColor: "black",
                            color: "white",
                            padding: "10px 10px 10px 10px",
                            fontSize: "large"
                        }} 
                        type="submit" 
                        onClick={this.login}
                    >
                        Login
                    </button>
                    <br/>
                    {this.state.errorLogin ? this.state.errorLogin : ""}
                </form>
            </div>
        )
    }
}

export default Login;