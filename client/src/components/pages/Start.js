import React, { Component } from "react";
import { Router, Link } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StartMenu from "../modules/StartMenu.js";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";

import "../../utilities.css";
import "./Start.css";
import { get } from "../../utilities";
import { navigate } from "@reach/router";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Start is the main page after the user logs in
 * @param user_id
 * @param user_name google name
 */
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
    // TODO: figure out if we need to do duplicate calls of this
    get("/api/whoami").then((user) => {
      // console.log("whoami");
      console.log(user);
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ user_id: user._id });
        this.setState({ user_name: user.name });
      }
      if (user.game_id) {
        // they are already in a game
        console.log(user);
        navigate("/lobby", {state: {
          user_id: this.state.user_id,  
          user_name: this.state.user_name,  
          game_id: user.game_id,
        }});
        // this.setState({ game_id: user.game_id}, () => {})
      }
    });
  }

  onLogin = (res) => {
    this.props.handleLogin(res);
    this.setState({user_id: "temp", loggedIn: true});
    // console.log("logged in...");
  }

  onLogout = (res) => {
    this.props.handleLogout(res);
    this.setState({user_id: null, loggedIn: false});
  }

  render() {
    if (this.props.user_id) {
      return (
        <>
          <div>hello, {this.props.user_name}! 
          <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.onLogout}
              onFailure={(err) => console.log(err)}
              render={(renderProps) => (
              <span
                onClick={renderProps.onClick}
                className="Start-googleButton u-pointer"
                >
                  logout
                </span>
              )}
            /></div>
          <div className="Start-title">
              <PlayerPanelTop/>
          </div>
          <div className="Start-startMenu">
              <StartMenu 
                user_id={this.props.user_id} 
                user_name={this.props.user_name}/>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="Start-title">
            <PlayerPanelTop/>
          </div>
          {/* <div className="Start-loginWelcomeMessage">
            login to with Google:
          </div> */}
          <div className="Start-loginButtonContainer">
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
              buttonText="login to start"
              onSuccess={this.onLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
          </div>
        </>
      );
    }
    
  }
}

export default Start;
