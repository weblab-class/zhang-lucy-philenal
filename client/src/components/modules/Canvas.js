import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./Canvas.css";
import board from "../../../../server/models/board.js";

import { get, post, put } from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

// const NUM_BLOCKS = this.props.canvas_width_blocks * this.props.canvas_height_blocks; 

/**
 * The Canvas is the main game board, where pixelers can fill pixels
 * @param game_id
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
    if (this.props.isGuesser || !this.props.isMyTurn) {
      return;
    }
    if (this.props.callback !=null){ //if it isn't null (isGuesser)
    console.log(`Clicked! ${filled}, ${id}`);
    this.props.callback(filled);
    if (filled) {
      this.setState({filled_blocks: this.state.filled_blocks + 1}, () => {
      });
    } else {
      this.setState({filled_blocks: this.state.filled_blocks - 1}, () => {
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
          game.board.num_filled = this.state.filled_blocks;
          game.board.pixels[id] = {id: id, _id: res[0].board.pixels[id]._id, color: "none", filled: filled};
          put("/api/game/pixel", 
          {
            pixel_id: id,
            pixel_id_filled: filled,
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
    
  }

  componentDidMount() {
    get("/api/game/canvas", {game_id: this.props.game_id
    }).then((res) => {
      if (res && res.length > 0) {
        this.setState({pixels: res[0].pixels});
      }
    }).catch((err) => {
      console.log(err);
    })  

    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          filled_blocks: updatedGame.board.num_filled,
        })
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id) { //if the game id sent out is ours
        console.log("cleareddd");
        this.setState({
          pixels: updatedGame.board.pixels,
        },()=>{console.log(this.state)})
      }
    });
  }

  render() {
    let pixels = [];
    if (this.state.pixels) {
      // let filledPixels = this.state.pixels.map((p)=>{p.filled});
      console.log("re-rendering");
      console.log(this.state.pixels);
      for (let i = 0; i < this.props.canvas_height_blocks * this.props.canvas_width_blocks; i++) {
        pixels.push(
          <div className="Canvas-pixelBlockContainer">
            <PixelBlock 
              game_id={this.props.game_id}
              id={this.state.pixels[i].id} 
              filled={this.state.pixels[i].filled}
              size={this.state.block_size}
              isGuesser={this.props.isGuesser}
              isMyTurn={this.props.isMyTurn}
              callback={this.onPixelClicked}
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
