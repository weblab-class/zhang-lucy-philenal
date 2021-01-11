import React, { Component } from "react";
import { Router, Link } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StartMenu from "../modules/StartMenu.js";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";

import "../../utilities.css";
import "./Start.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Start extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      loggedIn: false,
      user_id: null,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onLogin = (res) => {
    this.props.handleLogin(res);
    this.setState({user_id: "temp", loggedIn: true});
  }

  onLogout = (res) => {
    this.props.handleLogout(res);
    this.setState({user_id: null, loggedIn: false});
  }

  render() {
    if (this.props.user_id) {
      return (
        <>
          <div>hello, {this.props.userName}!</div>
          <div className="Start-title">
              <PlayerPanelTop/>
          </div>
          <div className="Start-startMenu">
              <StartMenu/>
          </div>
        </>
      );
    } else {
      return (
        <>
          {/* TODO (philena): prettify! maybe center everything?*/}
          <PlayerPanelTop/>
          <div className="Login-welcomeMessage">
            login to start:
          </div>
          {this.props.user_id ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.onLogout}
              onFailure={(err) => console.log(err)}
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.onLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
        </>
      );
    }
    
  }
}

export default Start;
