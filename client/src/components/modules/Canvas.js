import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Canvas.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

const CANVAS_WIDTH_BLOCKS = 10;
const CANVAS_HEIGHT_BLOCKS = 10;

class CanvasPanel extends Component {
  constructor(props) {
    super(props);

    const block_size = Math.floor(Math.min(CANVAS_HEIGHT_PX / CANVAS_HEIGHT_BLOCKS, CANVAS_WIDTH_PX / CANVAS_WIDTH_BLOCKS));
    console.log(`Block size: ${block_size}`);

    // Initialize Default State
    this.state = {
      block_size: block_size,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        hi i'm the canvas! paint on me :D
        <div className="Canvas"> </div>
      </>
    );
  }
}

export default CanvasPanel;
