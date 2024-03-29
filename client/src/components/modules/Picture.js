import React, { Component } from "react";
import "../../utilities.css";
import "./Picture.css";
import PixelBlock from "./PixelBlock.js";

const CANVAS_WIDTH_PX = 200;
const CANVAS_HEIGHT_PX = 200;

/**
 * The Picture is similar to a Canvas, showing the hall of fame/wall of shame
 * @param game_id
 * @param picture_width_blocks the width of the picture in blocks
 * @param picture_height_blocks the height of the picture in blocks
 * 
 */
class Picture extends Component {
  constructor(props) {
    super(props);

    const block_size = Math.floor(Math.min(CANVAS_HEIGHT_PX / this.props.picture_height_blocks, CANVAS_WIDTH_PX / this.props.picture_width_blocks));

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
      for (let i = 0; i < this.props.picture_height_blocks * this.props.picture_width_blocks; i++) {
        pixels.push(
            <PixelBlock 
              game_id={this.props.game_id}
              id={this.props.pixels[i].id} 
              filled={this.props.pixels[i].filled}
              actualColor={this.props.pixels[i].color}
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
