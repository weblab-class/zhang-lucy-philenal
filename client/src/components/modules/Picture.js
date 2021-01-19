import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./Picture.css";


// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 200;
const CANVAS_HEIGHT_PX = 200;

// const NUM_BLOCKS = this.props.picture_width_blocks * this.props.picture_height_blocks; 

/**
 * The Picture is the main game board, where pixelers can fill pixels
 * @param game_id
 * @param picture_width_blocks the width of the picture in blocks
 * @param picture_height_blocks the height of the picture in blocks
 * 
 */
class Picture extends Component {
  constructor(props) {
    super(props);

    const block_size = Math.floor(Math.min(CANVAS_HEIGHT_PX / this.props.picture_height_blocks, CANVAS_WIDTH_PX / this.props.picture_width_blocks));
    console.log(`Block size: ${block_size}`);

    // Initialize Default State
    this.state = {
      block_size: block_size,
      filled_blocks: 0,
    };
  }

  componentDidMount() {
    
  }

  render() {
    let pixels = [];
    if (this.props.pixels) {
      // let filledPixels = this.props.pixels.map((p)=>{p.filled});
      console.log("re-rendering");
      console.log(this.props.pixels);
      for (let i = 0; i < this.props.picture_height_blocks * this.props.picture_width_blocks; i++) {
        pixels.push(
        //   <div className="Picture-pixelBlockContainer">
            <PixelBlock 
              game_id={this.props.game_id}
              id={this.props.pixels[i].id} 
              filled={this.props.pixels[i]}
              size={this.state.block_size}
              isGuesser={this.props.isGuesser}
              isMyTurn={this.props.isMyTurn}
              callback={null}
            />
        //   </div>
        );
      }
    }

    return (
      <>
        <div className="Picture">
          {pixels}
        </div>
      </>
    );
  }
}

export default Picture;
