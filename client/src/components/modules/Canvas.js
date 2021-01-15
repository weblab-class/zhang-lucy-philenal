import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";

import "../../utilities.css";
import "./Canvas.css";
import board from "../../../../server/models/board.js";

import { get, put } from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

// const NUM_BLOCKS = this.props.canvas_width_blocks * this.props.canvas_height_blocks; 

/**
 * The Canvas is the main game board, where pixelers can fill pixels
 * 
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * 
 */
class Canvas extends Component {
  constructor(props) {
    super(props);

    const block_size = Math.floor(Math.min(CANVAS_HEIGHT_PX / this.props.canvas_height_blocks, CANVAS_WIDTH_PX / this.props.canvas_width_blocks));
    console.log(`Block size: ${block_size}`);

    // Initialize Default State
    this.state = {
      block_size: block_size,
      filled_blocks: 0,
    };
  }

  onPixelClicked = (filled, id) => {
    console.log(`Clicked! ${filled}, ${id}`);
    this.props.callback(filled);
    // TODO: api call
    if (filled) {
      this.setState({filled_blocks: this.state.filled_blocks + 1}, () => {
        // console.log(`pixels filled: ${this.state.filled_blocks}`)
      });
    } else {
      this.setState({filled_blocks: this.state.filled_blocks - 1}, () => {
        // console.log(`pixels filled: ${this.state.filled_blocks}`)
      });
    }

      get("/api/game/get", {game_id: this.props.game_id})
      .then((res) => {
        if (res.length == 0) {
          this.setState({game_not_found: true},
            console.log(`No game found with ID ${this.props.game_id}`)
          );
        } else {
          // make a copy
          let game = {...res[0]};
  
          // add our pixel
          // TODO: fix color
          game.board.pixels[id] = {id: id, _id: res[0].board.pixels[id]._id, color: "none", filled: filled};
          // console.log(`Pixel: 
          //           ${game.board.pixels[id]._id} 
          //           ${game.board.pixels[id].color} 
          //           ${game.board.pixels[id].filled}`);
          put("/api/game/pixel", 
          {
            game: game, 
            game_id: this.props.game_id
          })
          .then((res) => {
            // console.log("response");
            console.log(res);
          })
          .catch((err) => {
            console.log(err)
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    // TODO: make this API called
    let pixels = [];
    console.log(this.props.pixels);
    for (let i = 0; i < this.props.canvas_height_blocks * this.props.canvas_width_blocks; i++) {
      pixels.push(
        <div className="Canvas-pixelBlockContainer">
          <PixelBlock 
            id={this.props.pixels[i].id} 
            filled={this.props.pixels[i].filled}
            size={this.state.block_size}
            callback={this.onPixelClicked}
          />
        </div>
      );
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
