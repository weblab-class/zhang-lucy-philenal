import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./Canvas.css";

import { get, post, put } from "../../utilities";



// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

/**
 * The Canvas is the main game board, where pixelers can fill pixels
 * @param game_id
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param {String} background color of pixel in hex
 * 
 */
class Canvas extends Component {
  constructor(props) {
    super(props);

    const block_size = Math.floor(Math.min(CANVAS_HEIGHT_PX / this.props.canvas_height_blocks, CANVAS_WIDTH_PX / this.props.canvas_width_blocks));
    // console.log(`Block size: ${block_size}`);

    // Initialize Default State
    this.state = {
      block_size: block_size,
      filled_blocks: 0,
      canvasDisabled: false,
      my_filled_blocks: 0,
    };
  }

  onPixelClicked = (filled, id, actualColor) => {
    // check if user is allowed
    if (this.props.isGuesser || !this.props.isMyTurn) return;

    // if isGuesser
    if (!this.props.onPixelClicked) return;
    
    this.props.onPixelClicked(filled);
    if (filled) {
      this.setState({
        filled_blocks: this.state.filled_blocks + 1,
        my_filled_blocks: this.state.my_filled_blocks + 1
      });
    } else {
      this.setState({
        filled_blocks: this.state.filled_blocks - 1,
        my_filled_blocks: this.state.my_filled_blocks - 1
      });
    }

    
    put("/api/game/pixel", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
      pixel_id: id,
      pixel_color: actualColor,
      pixel_filled: filled,
      num_filled: this.state.filled_blocks,
    }).then((res) => {
      if (res.status == "error") {
        console.log(`error: ${res.msg}`);
      } else {
        console.log(res);
      }
    }).catch((err) => {
      console.log(err);
    });

  }

  componentDidMount() {
    this.is_mounted = true;
    get("/api/game/canvas", {game_id: this.props.game_id
    }).then((res) => {
      if (res) {
        console.log("canvas got!/")
        console.log(res);
        if (this.is_mounted){
          this.setState({
            pixels: res.pixels,});
        }
      }
    }).catch((err) => {
      console.log(err);
    });

    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id && this.is_mounted) { //if the game id sent out is ours
        this.setState({
          filled_blocks: updatedGame.board.num_filled,
        })
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id && this.is_mounted) { //if the game id sent out is ours
        // console.log("cleareddd");
        console.log("IT SHOULD BE CLEARED")
        this.setState({
          pixels: updatedGame.board.pixels,
        },()=>{//console.log(this.state)
        })
      }
    });

    socket.on("correct_guess", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id && this.is_mounted) { //if the game id sent out is ours
        this.setState({canvasDisabled: true});
      }
    });

   
  }

  componentWillUnmount() {
    this.is_mounted = false;
  }

  render() {
    let pixels = [];
    if (this.state.pixels) {
      for (let i = 0; i < this.props.canvas_height_blocks * this.props.canvas_width_blocks; i++) {
        pixels.push(
          <div className="Canvas-pixelBlockContainer">
            <PixelBlock 
              game_id={this.props.game_id}
              actualColor={this.state.pixels[i].color}
              id={this.state.pixels[i].id} 
              filled={this.state.pixels[i].filled}
              size={this.state.block_size}
              isGuesser={this.props.isGuesser}
              isMyTurn={this.props.isMyTurn}
              callback={this.onPixelClicked}
              disabled={this.state.canvasDisabled}
            />
          </div>
        );
      }
    }

    return (
      <>
        <div className="Canvas">
          {pixels}
        </div>
      </>
    );
  }
}

export default Canvas;
