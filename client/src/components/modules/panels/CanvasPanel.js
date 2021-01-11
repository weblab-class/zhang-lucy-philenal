import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";
import Canvas from "../Canvas.js";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class CanvasPanel extends Component {
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
        <div className="CanvasPanel">
          <div className="CanvasContainer">
            <Canvas/>
          </div>
        </div>
      </>
    );
  }
}

export default CanvasPanel;
