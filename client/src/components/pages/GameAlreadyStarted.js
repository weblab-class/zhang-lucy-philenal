import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop.js";
import "./GameAlreadyStarted.css";

class GameAlreadyStarted extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <div className="Start-title">
          <PlayerPanelTop/>
        </div>
        <div className="GameAlreadyStarted-container">
            Hi! Sorry, but the game that you have tried to joined has already started.
            <button
                onClick={()=>{navigate("/")}}
            >go back</button>
        </div>
      </>
    );
  }
}

export default GameAlreadyStarted;
