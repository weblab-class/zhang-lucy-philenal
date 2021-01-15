import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import PlayerPanelLeft from "../modules/panels/PlayerPanelLeft";
import PlayerPanelRight from "../modules/panels/PlayerPanelRight";
import CanvasPanel from "../modules/panels/CanvasPanel";

import "./Player.css";

import { get } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * This is the page view of one of the pixelers
 * TODO: Make a Player.js file with conditional rendering
 * between this Pixeler and the Guesser
 * 
 * @param game_id The ID of the game
 * @param user_id The ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
 * @param {String} word
 */
class Pixeler extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      canvas: {
        width: null,
        height: null,
        pixels: null,
      },
    };
  }

  //TODO: update canvas screen/pixeler screen
  processUpdate = (update) => {
    if (update.winner) {
      this.setState({ winner: update.winner });
    }
    //should change the pixeler screen
    //drawCanvas(update);
  };

  componentDidMount() {
    // remember -- api calls go here!
    socket.on("update", (update) => {
      this.processUpdate(update);
    });

    // TODO: unhardcode
    get("/api/game/canvas", {game_id: this.props.game_id})
    .then((res) => {
      if (res.length == 0) {
        // error with the props idk
        // TODO? figure out props probably
        navigate("/");
      } else {
        this.setState({canvas: res[0]}, () => {
          console.log(this.state)
        });
      }
    })
  }

  render() {
    return (
      <>
        <PlayerPanelTop/>
        <div className="u-flex">
          <div className="Player-subPanel">
            <PlayerPanelLeft players={this.props.players} word={this.props.word}/>
          </div>
          <div className="Player-subContainer">
            {(this.state.canvas.width) ?  <CanvasPanel 
              canvas_height_blocks={this.state.canvas.width} 
              canvas_width_blocks={this.state.canvas.height} 
              canvas_pixels={this.state.canvas.pixels}
              game_id={this.props.game_id}
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

export default Pixeler;
