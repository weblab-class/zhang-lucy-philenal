import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";

import "../../utilities.css";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import PlayerPanelLeft from "../modules/panels/PlayerPanelLeft";
import PlayerPanelRight from "../modules/panels/PlayerPanelRight";
import CanvasPanel from "../modules/panels/CanvasPanel";

import { get, post, put} from "../../utilities";
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
 * @param {Number} turn
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
    get("/api/game/get", {game_id: this.props.game_id})
    .then((res) => {
      this.setState({
        canvas: res[0].board, 
        pixelers: res[0].pixelers, 
        guesser: res[0].guesser}, () => {
        console.log("THIS IS THE GUESSER CONSOLE LOG: " + this.state);
      });
    })
    .catch((err) => {
      console.log(err);
    })
    //TODO: unhardcode game id for guesser
    socket.on("board_and_game_id", (board_and_game_id) => {
      if (this.props.game_id === board_and_game_id.game_id) { //if the game id sent out is ours
        this.setState({
          canvas: board_and_game_id.board,
        })
      }
    })
  }

  onCorrectGuess = (word) => {
    this.setState({word: word});
  }

  render() {
    // if (this.state.pixelers.length == 0){
    //   return (<div></div>)
    // } 
    return (
      <>
        <PlayerPanelTop/>
        hi you are the guesser!
        <div className="u-flex">
          <div className="Player-subPanel">
            {(this.state.pixelers) && 
            <PlayerPanelLeft 
              // game_id={this.props.game_id}
              // user_id={this.props.user_id}
              players={this.state.players} 
              pixelers={this.state.pixelers} 
              guesser={this.state.guesser} 
              wordLength={5}//this.state.word.length} 
              // TODO^^^^^^ very not SFB
              turn={this.state.turn}
              isGuesser={true}
              // guesser={{name: "peter"}}
              />
            }
          </div>
          <div className="Player-subContainer">
            {(this.state.canvas.width) &&  
            <CanvasPanel 
              canvas_height_blocks={this.state.canvas.width} 
              canvas_width_blocks={this.state.canvas.height} 
              canvas_pixels={this.state.canvas.pixels}
              game_id={this.props.game_id}
              isGuesser={true}
              word={this.state.word}
            /> } 
          </div>
          <div className="Player-subPanel">
            <PlayerPanelRight
            game_id={this.props.game_id}
            user_id={this.props.user_id}
            callback={this.onCorrectGuess}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Guesser;
