import React, { Component } from "react";
import { Router, Link } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
// import "./Login.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Login extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onLogin = (res) => {
    this.props.handleLogin(res);
  }

  onLogout = (res) => {
    this.props.handleLogout(res);
  }

  render() {
    if (this.state.loggedIn) {

    } else {
      return (
        <>
          {/* TODO (philena): prettify! maybe center everything?*/}
          <PlayerPanelTop/>
          <div className="Login-welcomeMessage">
            login to start:
          </div>
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={onLogout}
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

export default Login;
