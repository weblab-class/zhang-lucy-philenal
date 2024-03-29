import React, { Component, useState} from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import ReactLoading from 'react-loading';
import { get } from "../../utilities";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";
import MadeWithLuv from "../modules/MadeWithLuv.js";
import StartMenu from "../modules/StartMenu.js";
import ToggleButton from '../modules/ToggleButton';
import "./Start.css";
import "../../utilities.css";

const GOOGLE_CLIENT_ID = "556090196938-aq68ifs953on2phsnv7kl6nc59t5h0gf.apps.googleusercontent.com";
/**
 * Start is the main page after the user logs in. Contains the StartMenu component
 * 
 * (props passed from google login/logout)
 * @param _id google id
 * @param user_name google name
 * @param handleLogin function
 * @param handleLogout function
 */
class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      _id: null,
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
          _id: user._id, 
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
        _id: "temp", 
        loggedIn: true,
        buttonDisabled: true,
      }, () => {
        this.setState({
          isLoading: false,
        });
      });
    })
  }

  onLogout = () => {
    this.setState({isLoading: true}, () => {
      this.props.handleLogout();
      this.setState({
        _id: null, 
        loggedIn: false,
        isLoading: false,
      });
    })
  }

  render() {

    if (this.props._id) {
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
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                      <button className="Start-googleButton u-pointer" onClick={() => {
                          googleLogout();
                          this.onLogout();
                        }}>
                        logout
                      </button>
                    </GoogleOAuthProvider>
                </div>
                <ToggleButton/>
              </div>
                
                
                <div className="Start-title">
                    <PlayerPanelTop/>
                </div>
                <div className="Start-startMenu">
                    <StartMenu 
                      className={this.state.theme}
                      _id={this.props._id} 
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
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    {this.props._id ? (
                      <button className="Start-googleButton u-pointer" onClick={() => {
                        googleLogout();
                        this.onLogout();
                      }}>
                        logout
                      </button>
                    ) : (
                      <GoogleLogin onSuccess={this.onLogin} onError={(err) => console.log(err)} />
                    )}
                  </GoogleOAuthProvider>
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
