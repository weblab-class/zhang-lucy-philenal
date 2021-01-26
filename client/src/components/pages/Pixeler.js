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

import { get, post } from "../../utilities";

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
 * ~~@param {String} word~~
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
    if (update.winner && this.is_mounted) {
      this.setState({ winner: update.winner });
    }
    //should change the pixeler screen
    //drawCanvas(update);
  };

  componentWillUnmount() {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;

    // remember -- api calls go here!
    //TODO: can delete if we don't use logic.js ??
    socket.on("update", (update) => {
      this.processUpdate(update);
    });

    // TODO: LUCY CHANGE
    get("/api/game/get", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      if (this.is_mounted) {
        this.setState({
          canvas: res.board, 
          word: res.word, 
          pixelers: res.pixelers, 
          guesser: res.guesser,
          pixel_limit: res.pixel_limit,
        }, ()=>{console.log(this.state.pixel_limit)});
      }
    })
    .catch((err) => {
      console.log(err);
    })

    // TODO: unhardcode
    get("/api/game/canvas", {
      game_id: this.props.game_id,
    }).then((res) => {
      if (res && this.is_mounted) {
        this.setState({canvas: res}, () => {
          console.log(this.state)
        });
      }
    })

    //listens for updated canvas
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id && this.is_mounted) { //if the game id sent out is ours
        this.setState({
          canvas: updatedGame.board,
        })
      }
    })
    
  }

  leaveGame = () => {
    post("/api/user/leave", {
      user_id: this.props.user_id,
      game_id: this.props.game_id,
    }).then((res) => {
      if (res.success) { 
        navigate("/");
      }
    })
  }

  clearCanvas = () => {
    post("/api/board/clear_pixels", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      if (res && res.board) {
        this.setState({pixels: res.board.pixels});
      }
    }).catch((err) => {
      console.log(err);
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
          <div>hello, {this.props.user_name}!</div>
          <button onClick={this.leaveGame}>leave game</button>
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
                word={this.state.word} 
                turn={this.props.turn} 
                leaveGame={this.leaveGame}
                />
            </div>
            <div className="Player-subContainer">
              {(this.state.canvas.width) &&  <CanvasPanel 
                canvas_height_blocks={this.state.canvas.width} 
                canvas_width_blocks={this.state.canvas.height} 
                canvas_pixels={this.state.canvas.pixels}
                pixel_limit={this.state.pixel_limit}
                game_id={this.props.game_id}
                user_id={this.props.user_id}
                isMyTurn={this.props.turn < this.state.pixelers.length && this.state.pixelers[this.props.turn]._id===this.props.user_id}
                isGuesser={false}
                clearCanvas={this.clearCanvas}
              />} 
            </div>
            <div className="Player-subPanel">
              <PlayerPanelRight
                game_id={this.props.game_id}
                user_id={this.props.user_id}
                isGuesser={false}
              />
            </div>
          </div>
        </>
      );
    }
    
  }
}

export default Pixeler;
