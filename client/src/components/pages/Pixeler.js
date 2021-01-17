import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import { navigate } from "@reach/router";

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
 * @param {Number} turn
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
      pixelers: [],
      guesser: {},
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
    //TODO: can delete if we don't use logic.js ??
    socket.on("update", (update) => {
      this.processUpdate(update);
    });

    get("/api/game/get", {game_id: this.props.game_id})
    .then((res) => {
      this.setState({canvas: res[0].board, pixelers: res[0].pixelers, guesser: res[0].guesser}, () => {
        console.log("THIS IS THE PIXELER CONSOLE LOG: " + this.state);
      });
    })
    .catch((err) => {
      console.log(err);
    })

    // TODO: unhardcode
    get("/api/game/canvas", {game_id: this.props.game_id}).then((res) => {
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

    //listens for updated canvas
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          canvas: updatedGame.board,
        })
      }
    })
    
  }

  render() {
    /* console.log("TURN'S ID IS " + this.state.pixelers[this.props.turn]._id + " and USER ID IS " + this.props.user_id) */
    console.log("turn number " + this.props.turn);
    console.log("user id " + this.props.user_id);
    
    if (this.state.pixelers.length == 0){
      return (<div></div>)
    } else{
      return (
        <>
          <PlayerPanelTop/>
          {/* {"TURN'S ID IS " + this.state.pixelers[this.props.turn]._id + " and USER ID IS " + this.props.user_id} */}
          {this.props.turn < this.state.pixelers.length ? 
          console.log("is it my turn " + (this.state.pixelers[this.props.turn]._id === this.props.user_id)): 
          console.log("guesser's turn")}
          {/* {console.log("turn id " + this.state.pixelers[this.props.turn]._id + "user id " + this.props.user_id)} */}
          <div className="u-flex">
            <div className="Player-subPanel">
              <PlayerPanelLeft 
                guesser={this.state.guesser} 
                pixelers={this.state.pixelers} 
                word={this.props.word} 
                turn={this.props.turn} />
            </div>
            <div className="Player-subContainer">
              {(this.state.canvas.width) ?  <CanvasPanel 
                canvas_height_blocks={this.state.canvas.width} 
                canvas_width_blocks={this.state.canvas.height} 
                canvas_pixels={this.state.canvas.pixels}
                game_id={this.props.game_id}
                isMyTurn={this.props.turn < this.state.pixelers.length && this.state.pixelers[this.props.turn]._id===this.props.user_id}
                isGuesser={false} //change to make more secure
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
}

export default Pixeler;
