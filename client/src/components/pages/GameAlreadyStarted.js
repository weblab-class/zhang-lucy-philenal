import React, { Component } from "react";
import { Router, Link } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { navigate } from "@reach/router";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";

import "../../utilities.css";
import "./GameAlreadyStarted.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class GameAlreadyStarted extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  goBack = () => {
    navigate("/");
  }

  render() {
    // TODO (LHF): make this prettier (add margin in between)
    return (
      <>
        <div className="Start-title">
          <PlayerPanelTop/>
        </div>
        <div className="GameAlreadyStarted-container">
            Hi! Sorry, but the game that you have tried to joined has already started.
            <button
                onClick={this.goBack}
            >go back</button>
        </div>
      </>
    );
  }
}

export default GameAlreadyStarted;
