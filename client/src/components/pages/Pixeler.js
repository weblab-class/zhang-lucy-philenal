import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import PlayerPanelTop from "../modules/PlayerPanelTop";
import PlayerPanelLeft from "../modules/PlayerPanelLeft";
import PlayerPanelRight from "../modules/PlayerPanelRight";
import Canvas from "../modules/Canvas";

// TBD?
import "./Player.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Pixeler extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      name: "Philena",
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <PlayerPanelTop/>
        <div className="u-flex">
          <div className="Player-subPanel">
            <PlayerPanelLeft/>
          </div>
          <div className="Player-subContainer">
            <Canvas/>
          </div>
          <div className="Player-subPanel">
            <PlayerPanelRight/>
          </div>
        </div>
        {/* <p>hi you are the pixeler!</p>
        <p>your name is {this.state.name}</p> */}
      </>
    );
  }
}

export default Pixeler;
