import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import CanvasPanel from "../modules/panels/CanvasPanel";
// TBD?
// import "./Guesser.css";

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
class Guesser extends Component {
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
        <PlayerPanelTop/>
        hi you are the guesser!
        <div className="u-flex">
          <div className="Player-subPanel">
            <PlayerPanelLeft players={this.props.players} word={this.props.word}/>
          </div>
          <div className="Player-subContainer">
            {(this.state.canvas.width) ?  <CanvasPanel 
              canvas_height_blocks={this.state.canvas.width} 
              canvas_width_blocks={this.state.canvas.height} 
              canvas_pixels={this.state.canvas.pixels}
              game_id="bob"
            /> : <div></div>} 
          </div>
          <div className="Player-subPanel">
            <PlayerPanelRight/>
          </div>
        </div>
      </>
    );
  }
}

export default Guesser;
