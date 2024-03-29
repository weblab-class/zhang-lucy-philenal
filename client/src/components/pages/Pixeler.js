import { navigate } from "@reach/router";
import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import "../../utilities.css";
import CanvasPanel from "../modules/panels/CanvasPanel";
import PlayerPanelLeft from "../modules/panels/PlayerPanelLeft";
import PlayerPanelRight from "../modules/panels/PlayerPanelRight";
import PlayerPanelTop from "../modules/panels/PlayerPanelTop";
import ToggleButton from '../modules/ToggleButton';

import "./Player.css";

/**
 * This is the page view of one of the pixelers
 * between this Pixeler and the Guesser
 * 
 * @param game_id The ID of the game
 * @param _id The ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
 * ~~@param {String} word~~
 * @param {Number} turn
 * @param {Number} round -- starts at 1
 * @param {Number} maxSessions
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
      leaveGameConfirmation: false,
    };
  }

  componentWillUnmount() {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;

    get("api/user/get", {
      _id: this.props._id,
    }).then((res) => {
      if (this.is_mounted) {
        this.setState({
          user_name: res[0].name,
        });
      }
    });

    get("/api/game/get", {
      game_id: this.props.game_id,
      _id: this.props._id,
    }).then((res) => {
      if (this.is_mounted) {
        this.setState({
          canvas: res.board, 
          word: res.word, 
          pixelers: res.pixelers, 
          guesser: res.guesser,
          pixel_limit: res.pixel_limit,
        }, ()=>{});
      }
    })
    .catch((err) => {
      console.log(err);
    })

    get("/api/game/canvas", {
      game_id: this.props.game_id,
      _id: this.props._id,
    }).then((res) => {
      if (res && this.is_mounted) {
        this.setState({canvas: res}, () => {
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
    navigate("/");
  }

  clearCanvas = () => {
    post("/api/board/clear_pixels", {
      game_id: this.props.game_id,
      _id: this.props._id,
    }).then((res) => {
      if (res && res.board) {
        this.setState({pixels: res.board.pixels});
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    if (this.state.pixelers.length == 0 || this.state.user_name==null || this.props.turn==null || this.props.maxSessions==null || this.props.round==null){
      return (<div></div>)
    } else{
      return (
        <>
        <div className="u-welcome">
          <div>
          hello, {this.state.user_name}!
          </div>
          <div>
          <div>game id: {this.props.game_id}</div>
          </div>
        </div>
        <div className="u-welcome">
          <div className="Player-subheader">
            <button onClick={()=>this.setState({leaveGameConfirmation: true})}>leave game</button>
            {this.state.leaveGameConfirmation && 
            <div className="Player-quitConfirmationContainer">
                <div className="Player-quitConfirmationChild">
                    are you sure?
                </div>
                <div className="Player-quitConfirmationChild">
                    <button className="Player-quitConfirmationButton"
                      onClick={this.leaveGame}>
                        yes, leave
                    </button>
                    <button className="Player-quitConfirmationButton"
                      onClick={()=>{this.setState({leaveGameConfirmation: false})}}>
                        cancel
                    </button>
                </div>
            </div>}

          </div>
          <ToggleButton/>
        </div>

          <PlayerPanelTop/>
          <div className="Player-container">
            <div className="Player-subPanel">
              <PlayerPanelLeft 
                game_id={this.props.game_id}
                guesser={this.state.guesser} 
                pixelers={this.state.pixelers} 
                word={this.state.word} 
                turn={this.props.turn} 
                round={this.props.round}
                maxSessions={this.props.maxSessions}
                leaveGame={this.leaveGame}
                />
            </div>
            <div className="Player-subContainer">
              {(this.state.canvas.width) &&  <CanvasPanel 
                canvas_height_blocks={this.state.canvas.width} 
                canvas_width_blocks={this.state.canvas.height} 
                pixel_limit={this.state.pixel_limit}
                game_id={this.props.game_id}
                _id={this.props._id}
                isMyTurn={this.props.turn < this.state.pixelers.length && 
                    this.state.pixelers[this.props.turn]._id===this.props._id}
                isGuesser={false}
                clearCanvas={this.clearCanvas}
              />} 
            </div>
            <div className="Player-subPanel">
              <PlayerPanelRight
                game_id={this.props.game_id}
                _id={this.props._id}
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
