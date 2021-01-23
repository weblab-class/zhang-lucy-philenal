import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import { navigate } from "@reach/router";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import PlayerPanelLeft from "../modules/panels/PlayerPanelLeft";
import PlayerPanelRight from "../modules/panels/PlayerPanelRight";
import CanvasPanel from "../modules/panels/CanvasPanel";

import { get, post, put} from "../../utilities";
// TBD?
// import "./Guesser.css";


/**
 * This is the page view of the Guesser
 * 
 * ~@param game_id The ID of the game~ (no longer)
 * @param user_id The ID of the particular player
 * @param {Number} turn
 * @param {String} hiddenWord is "_ _ _ " if not guessed correctly, but shows actual word if guessed correctly
 * @param {Callback} onCorrectGuess function
 * @param {Boolean} correctGuess
 */
class Guesser extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      //is it bad to set this as state when it's changing based off of pixeler moves
      canvas: {},
      word: "",
      // pixelers: [],
      // guesser: {},
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/game/get", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      this.setState({
        canvas: res.board, 
        pixelers: res.pixelers, 
        guesser: res.guesser}, () => {
      });
    })
    .catch((err) => {
      console.log(err);
    })

    //TODO: unhardcode game id for guesser
    //listens for updated canvas
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          canvas: updatedGame.board,
        })
      }
    })
  }

/*   onCorrectGuess = (word) => {
    this.setState({word: word});
    this.setState({correctGuess: true});
  } */

  leaveGame = () => {
    console.log(this.props);
    post("/api/user/leave", {
      user_id: this.props.user_id,
      game_id: this.props.game_id,
    }).then((res) => {
      if (res.success) { 
        navigate("/");
      }
    })
  }


  render() {
    // if (this.state.pixelers.length == 0){
    //   return (<div></div>)
    // } 
    return (
      <>
        <PlayerPanelTop/>
        <div className="u-flex">
          <div className="Player-subPanel">
            {(this.state.pixelers) && 
            <PlayerPanelLeft 
              /* players={this.state.players}  */
              pixelers={this.state.pixelers} 
              guesser={this.state.guesser} 
              word={this.props.hiddenWord}
              /* wordLength={this.props.wordLength} *///this.state.word.length} 
              // TODO^^^^^^ very not SFB
              turn={this.props.turn}
              isGuesser={true}
              leaveGame={this.leaveGame}
              />
            }
          </div>
          <div className="Player-subContainer">
            {(this.state.canvas.width) &&  
            <CanvasPanel 
              canvas_height_blocks={this.state.canvas.width} // TODO: remove
              canvas_width_blocks={this.state.canvas.height} 
              canvas_pixels={this.state.canvas.pixels}
              game_id={this.props.game_id}
              user_id={this.props.user_id}
              isMyTurn={true} //TODO: unhardcode, make more secure
              isGuesser={true} //TODO: unhardcode
              correctGuess={this.props.correctGuess}
            /> } 
          </div>
          <div className="Player-subPanel">
            <PlayerPanelRight
              game_id={this.props.game_id}
              user_id={this.props.user_id}
              callback={this.props.callback}
              isGuesser={true}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Guesser;
