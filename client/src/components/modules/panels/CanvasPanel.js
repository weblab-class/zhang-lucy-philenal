import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./PlayerPanel.css";
import Canvas from "../Canvas.js";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * The CanvasPanel is the entire middle panel below the title, containing the Canvas
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param isGuesser - Boolean if player is guesser
 * 
 */
class CanvasPanel extends Component {
  constructor(props) {
    super(props);

    let num_filled = 0;
    for (let i = 0; i < this.props.canvas_pixels.length; i++) {
      if (this.props.canvas_pixels[i].filled) {
        num_filled += 1;
      };
    }

    // Initialize Default State
    this.state = {
      num_filled: num_filled,
    };
  }

  componentDidMount() {
  }

  onPixelClicked = (filled) => {
    if (filled) {
      this.setState({num_filled: this.state.num_filled + 1});
    } else {
      this.setState({num_filled: this.state.num_filled - 1});
    }
  }


  render() {
    return (
      <>
        <div className="CanvasPanel">
          <div className="CanvasContainer">
            <Canvas 
              canvas_height_blocks={this.props.canvas_height_blocks} 
              canvas_width_blocks={this.props.canvas_width_blocks} 
              pixels={this.props.canvas_pixels} 
              game_id={this.props.game_id}
              isGuesser={this.props.isGuesser}
              callback={this.props.isGuesser ? null: this.onPixelClicked}
            />
            <div className="Canvas-footer">
              {/* pixels remaining: {this.state.num_filled} */}
              pixels filled: {this.state.num_filled}
            </div>
          </div>
          {/* TODO (philena): Make this prettier */}
          {/* TODO (lucy): Add callback function so we can actually access this.state.num_filled */}
          
        </div>

      </>
    );
  }
}

export default CanvasPanel;
