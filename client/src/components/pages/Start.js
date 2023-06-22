import React, { Component, useState} from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import ReactLoading from 'react-loading';
import { get } from "../../utilities";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";
import MadeWithLuv from "../modules/MadeWithLuv.js";
import StartMenu from "../modules/StartMenu.js";
import ToggleButton from '../modules/ToggleButton';
import "./Start.css";
import "../../utilities.css";
// import "../../utilities.scss";
// import "../../variables.scss";
// import "../App.scss";

const GOOGLE_CLIENT_ID = "556090196938-aq68ifs953on2phsnv7kl6nc59t5h0gf.apps.googleusercontent.com";
/**
 * Start is the main page after the user logs in. Contains the StartMenu component
 * 
 * (props passed from google login/logout)
 * @param user_id google id
 * @param user_name google name
 * @param handleLogin function
 * @param handleLogout function
 */
class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user_id: null,
      isLoading: true,
      buttonDisabled: false,
      theme: "light"
    };
  }

  componentWillUnmount () {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;
    get("/api/whoami").then((user) => {
      console.log(user);
      if (user._id && this.is_mounted) {
        this.setState({ 
          user_id: user._id, 
          user_name: user.name,
        });
      }
      this.setState({
        isLoading: false,
      });
    });
  }

  onClick = () => {
    this.setState({isLoading: true, buttonDisabled: true})
  }
  
  onLogin = (res) => {
    this.setState({isLoading: true}, () => {
      this.props.handleLogin(res);
      this.setState({
        user_id: "temp", 
        loggedIn: true,
        buttonDisabled: true,
      }, () => {
        this.setState({
          isLoading: false,
        });
      });
    })
  }

  onLogout = (res) => {
    this.setState({isLoading: true}, () => {
      this.props.handleLogout(res);
      this.setState({
        user_id: null, 
        loggedIn: false,
        isLoading: false,
      });
    })
  }

  render() {

    if (this.props.user_id) {
      return (
        <>
          {this.state.isLoading ?
            <div className={`LoadingScreen`}> 
                <ReactLoading type={"bars"} color={"grey"} />
            </div> :
            <div className={`Start-background`}>
              <div className={`u-welcome`}>
                <div>
                  hello, {this.props.user_name}! 
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
                    />
                </div>
                <ToggleButton/>
              </div>
                
                
                <div className="Start-title">
                    <PlayerPanelTop/>
                </div>
                <div className="Start-startMenu">
                    <StartMenu 
                      className={this.state.theme}
                      user_id={this.props.user_id} 
                      user_name={this.props.user_name}/>
                </div>
                <MadeWithLuv />
              </div>
          }
        </>
      );
    } else {
      return (
        <>
        {this.state.isLoading ?
        <div className="LoadingScreen"> 
            <ReactLoading type={"bars"} color={"grey"} />
        </div> :
        <div>
          <div className="Start-title">
            <PlayerPanelTop/>
          </div>
          <div className="Start-loginButtonContainer">
          {this.props.user_id ? (
            // <GoogleLogout
            //   clientId={GOOGLE_CLIENT_ID}
            //   buttonText="Logout"
            //   onLogoutSuccess={this.onLogout}
            //   onFailure={(err) => console.log(err)}
            // />
            <div class="g-signout2" data-onsuccess="onLogout"></div>
          ) : (
            // <GoogleLogin
            //   clientId={GOOGLE_CLIENT_ID}
            //   buttonText="login to start"
            //   onSuccess={this.onLogin}
            //   disabled={this.state.buttonDisabled}
            //   onRequest={this.onClick}
            //   onFailure={(err) => console.log(err)}
            // />
            <div class="g-signin2" data-onsuccess="onLogin"></div>
          )}
          </div>
        </div>
        }
        <MadeWithLuv/>
        </>
      );
    }
    
  }
}

export default Start;
