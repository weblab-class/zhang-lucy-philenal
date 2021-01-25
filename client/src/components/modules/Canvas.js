import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./Canvas.css";

import { get, put } from "../../utilities";



// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

/**
 * The Canvas is the main game board, where pixelers can fill pixels
 * Calls get canvas, and put for pixel input
 * 
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
      at_limit: false, // user has clicked their allotted pixels, lock canvas
    };
  }

  onPixelClicked = (filled, id, actualColor) => {
    // check if user is allowed
    if (this.props.isGuesser || !this.props.isMyTurn || !this.props.onPixelClicked) return;

    // // exceeded limit, 
    // if (filled) {

    // }

    this.props.onPixelClicked(filled);
    if (filled) {
      this.setState({
        filled_blocks: this.state.filled_blocks + 1,
      }, () => {

        console.log("increadse");
        console.log(`filled blcoke: ${this.state.filled_blocks}`);
        console.log(`filled limit: ${this.props.pixel_limit}`);
        if (this.state.filled_blocks >= this.props.pixel_limit) {
          console.log(`at limit: ${this.state.at_limit}`)
          this.setState({at_limit: true},()=>{console.log(`at limit: ${this.state.at_limit}`)});
        }

      });
    } else {
      this.setState({
        filled_blocks: this.state.filled_blocks - 1,
      }, () => {

        console.log("decareads");

        console.log(`filled blcoke: ${this.state.filled_blocks}`);
        console.log(`filled limit: ${this.props.pixel_limit}`);
        if (this.state.filled_blocks >= this.props.pixel_limit) {
          console.log(`at limit: ${this.state.at_limit}`)
          this.setState({at_limit: true},()=>{console.log(`at limit: ${this.state.at_limit}`)});
        }

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
            pixels: res.pixels,
          });
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
              at_limit={this.state.at_limit}
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
