import React, { Component} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import './App.css';
import auth from './auth/auth';

import NavigationBar from './containers/NavigationBar/NavigationBar';
import Login from './components/User/Login/Login';
import Logout from './components/User/Logout/Logout';
import SignUp from './components/User/SignUp/SignUp';
import EditUserInfo from './components/User/EditUserInfo/EditUserInfo';
import Newsfeed from './components/Newsfeed/Newsfeed';
import Friends from './components/Friends/Friends/Friends';
import UserStatusUpdate from './components/User/UserMainPage/UserStatusUpdate/UserStatusUpdate';
import firebase from './config/Firebase';


class App extends Component {

  state = {
    user: {}
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user)=> {
      //console.log(user);
      if (user) {
        this.setState({ 
          user 
        }, 
        localStorage.setItem('user', user.uid), 
        localStorage.setItem('userDisplayFirstName', user.displayName));
        localStorage.setItem('userProfilePicture', user.photoURL)
      } else {
        this.setState({ 
          user: null
        });
      }
    })   
  }

  render() {

    if (localStorage.getItem('user')) {
      auth.login();
    }

    return (
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
          <Switch>
 
            <Route path="/" exact  component={Login}/>
            <Route path="/sign-up" component={SignUp} />
            <PrivateRoute path="/feed" component={Newsfeed} />
            <PrivateRoute path="/main/:id" component={UserStatusUpdate} />
            <PrivateRoute path="/friends" component={Friends} />
            <PrivateRoute path="/user-settings" component={EditUserInfo} />
            <PrivateRoute path="/logout" component={Logout }/>
            
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
