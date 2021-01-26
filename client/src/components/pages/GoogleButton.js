import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import "../../utilities.css";
import "./GoogleButton.css";

class GoogleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user_id: null,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      console.log(user);
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ user_id: user._id });
        this.setState({ user_name: user.name });
      }
    });
  }

  onLogin = (res) => {
    this.handleLogin(res);
    this.setState({loggedIn: true});
  }

  onLogout = (res) => {
    this.handleLogout(res);
    this.setState({loggedIn: false});
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ user_id: user._id, user_name: res.profileObj.name});
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    console.log("logged out")
    this.setState({ user_id: undefined, user_name: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
      {this.state.loggedIn ? 
      <div>hello, {this.props.user_name}! 
      {/* custom styling for google login: https://stackoverflow.com/questions/55023073/react-google-login-inline-styling */}
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
        /></div>:
        <div>hello! 
          <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onLoginSuccess={this.onLogin}
              onFailure={(err) => console.log(err)}
              render={(renderProps) => (
              <span
                onClick={renderProps.onClick}
                className="Start-googleButton u-pointer"
                >
                  (login)
                </span>
              )}
            /></div>}
      </>
    );
  }
}

export default GoogleButton;
