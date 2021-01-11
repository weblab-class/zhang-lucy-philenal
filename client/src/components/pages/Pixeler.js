import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import PlayerPanelLeft from "../modules/panels/PlayerPanelLeft";
import PlayerPanelRight from "../modules/panels/PlayerPanelRight";
import CanvasPanel from "../modules/panels/CanvasPanel";

import "./Player.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * This is the page view of one of the pixelers
 * TODO: Make a Player.js file with conditional rendering
 * between this Pixeler and the Guesser
 * 
 * @param game_id The ID of the game
 * @param user_id The ID of the particular player
 */
class Pixeler extends Component {
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
        <PlayerPanelTop/>
        <div className="u-flex">
          <div className="Player-subPanel">
            <PlayerPanelLeft/>
          </div>
          <div className="Player-subContainer">
            <CanvasPanel canvas_height_blocks={20} canvas_width_blocks={20} />
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
