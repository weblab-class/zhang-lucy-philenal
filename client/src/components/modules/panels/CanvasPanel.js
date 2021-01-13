import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";
import Canvas from "../Canvas.js";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * The CanvasPanel is the entire middle panel below the title, containing the Canvas
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * 
 */
class CanvasPanel extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      filled_blocks: 0,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }


  render() {
    return (
      <>
        <div className="CanvasPanel">
          <div className="CanvasContainer">
            <Canvas 
              canvas_height_blocks={this.props.canvas_height_blocks} 
              canvas_width_blocks={this.props.canvas_width_blocks} 
            />
            <div className="Canvas-footer">
              {/* pixels remaining: {this.state.filled_blocks} */}
              pixels remaining: 5
            </div>
          </div>
          {/* TODO (philena): Make this prettier */}
          {/* TODO (lucy): Add callback function so we can actually access this.state.filled_blocks */}
          
        </div>

      </>
    );
  }
}

export default CanvasPanel;
