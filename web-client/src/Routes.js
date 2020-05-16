import React, { Component } from "react";
import {Switch, Route, withRouter, Redirect, BrowserRouter as Router} from "react-router-dom"
import LoginForm from "./containers/LoginForm";
import RegisterForm from "./containers/RegisterForm";
import Home from "./containers/Home";

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/login' component={withRouter(LoginForm)}/>
                    <Route exact path="/register" component={RegisterForm}/>
                    <Route exact path="/home" component={withRouter(Home)}/>
                    <Redirect exact path="/" to="home"/>
                </Switch>
            </Router>
        )
    }
};