import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./StartMenu.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class StartMenu extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="StartMenu-buttonsRow">
            <div className="StartMenu-linkContainer">
                <Link to="/skeleton" state={{
                  user_id: this.props.user_id,
                  user_name: this.props.user_name,
                }}
                >
                    <button className="StartMenu-button u-color-1 u-pointer">how to play</button>
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/newgame" state={{
                  user_id: this.props.user_id,
                  user_name: this.props.user_name,
                }}>
                  <button className="StartMenu-button u-color-2 u-pointer">new game</button>
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/joingame" state={{
                  user_id: this.props.user_id,
                  user_name: this.props.user_name,
                }}>
                  <button className="StartMenu-button u-color-3 u-pointer">join game</button>
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/wall" state={{
                  user_id: this.props.user_id,
                  user_name: this.props.user_name,
                }}>
                  <button className="StartMenu-button u-color-4 u-pointer">wall</button>
                </Link>
            </div>
        </div>
      </>
    );
  }
}

export default StartMenu;
