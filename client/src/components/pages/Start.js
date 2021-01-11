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
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="Start-title">
            <PlayerPanelTop/>
        </div>
        <div className="Start-startMenu">
            <StartMenu/>
        </div>
      </>
    );
  }
}

export default Start;
