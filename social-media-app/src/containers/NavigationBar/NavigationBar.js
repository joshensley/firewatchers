import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationBar.module.css';

class NavigationBar extends Component {

    render() {

        let userLoggedIn = false
        if (localStorage.getItem('user')) {
            userLoggedIn = true
        }

        const userIdPath = `/main/${localStorage.getItem('user')}` 

        return (
            <header style={{padding: "0px 0px 30px 0px"}}>
                <nav className={classes.Nav}>
                    <ul className={classes.UnorderedList}>

                        {
                            userLoggedIn ? 
                            <div>
                                <li className={classes.Firewatchers}>
                                    Firewatchers
                                </li>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/logout" exact>
                                        Logout
                                    </NavLink>
                                </li>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/user-settings" exact>
                                        User Settings
                                    </NavLink>
                                </li>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/friends" exact>
                                        Friends
                                    </NavLink>
                                </li>
                                
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/feed" exact>
                                        Feed
                                    </NavLink>
                                </li>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to={userIdPath} exact>
                                        Main
                                    </NavLink>
                                </li>
                                
                            </div>
                            :
                            <div>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/sign-up" exact>
                                        Sign Up
                                    </NavLink>
                                </li>
                                <li className={classes.ListItem}>
                                    <NavLink className={classes.NavLink} to="/" exact>
                                        Login
                                    </NavLink>
                                </li>
                            </div>
                        }

                        
                    </ul>
                </nav>
            </header>
        )



    }

    
};

export default NavigationBar;