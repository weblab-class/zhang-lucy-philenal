import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PixelBlock from "./PixelBlock.js";

import "../../utilities.css";
import "./Canvas.css";

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

  onPixelClicked = (filled) => {
    console.log(filled);
    if (filled) {
      this.setState({filled_blocks: this.state.filled_blocks + 1}, () => {
        console.log(`pixels filled: ${this.state.filled_blocks}`)
      });
    } else {
      // console.log("pixel unclicked!");
      this.setState({filled_blocks: this.state.filled_blocks - 1}, () => {
        console.log(`pixels filled: ${this.state.filled_blocks}`)
      });
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    let pixels = []
    let _id = 0;
    for (let i = 0; i < this.props.canvas_height_blocks; i++) {
      for (let j = 0; j < this.props.canvas_width_blocks; j++) {
        pixels.push(
          <div className="Canvas-pixelBlockContainer">
            <PixelBlock 
              _id={_id} 
              size={this.state.block_size}
              callback={this.onPixelClicked}
            />
          </div>
        );
        _id++;
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
