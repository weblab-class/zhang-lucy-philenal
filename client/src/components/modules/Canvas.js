import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { GithubPicker } from 'react-color';
import PixelBlock from "./PixelBlock.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./Canvas.css";

import { get, post, put } from "../../utilities";



// TODO: Un-hardcode, have this be read in as a prop
const CANVAS_WIDTH_PX = 500;
const CANVAS_HEIGHT_PX = 500;

// const NUM_BLOCKS = this.props.canvas_width_blocks * this.props.canvas_height_blocks; 

/**
 * The Canvas is the main game board, where pixelers can fill pixels
 * @param game_id
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param {String} color color of pixel in hex
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
      canvasDisabled: false,
      pixels: null,
      color: '#F898A4',
      colorPalette: ['#F898A4', '#FCDA9C', '#F7FAA1', '#B4F6A4', '#9BE0F1', '#A2ACEB', '#ffffff', '#ece0d1', '	#e0a899', '#aa6f73', '#a39193', '#66545e'],
    };
  }

  componentDidMount() {
    //gets the pixels
    get("/api/game/canvas", {game_id: this.props.game_id
    }).then((res) => {
      if (res && res.length > 0) {
        this.setState({pixels: res[0].pixels});
      }
    }).catch((err) => {
      console.log(err);
    })  

    //updates the pixels
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          filled_blocks: updatedGame.board.num_filled,
          pixels: updatedGame.board.pixels,
        })
      }
    });
    
    socket.on("nextWord", (updatedGame) =>{
      if (this.props.game_id === updatedGame.game_id) {
        // clear the canvas
        this.setState({
          pixels: updatedGame.board.pixels,
        });
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        console.log("cleareddd");
        this.setState({
          pixels: updatedGame.board.pixels,
        },()=>{
          /* for (let i=0; i < this.state.pixels.length; i ++){
            if (this.state.pixels[i].color != "none"){
              console.log("I HATE THIS " + this.state.pixels[i].color);
            }
          } */
        });
  }});

    socket.on("correct_guess", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({canvasDisabled: true});
      }
    });

  }
  /* color switcher */
  handleChangeComplete = (color, event) => {
    /* this.setState({ color: color.hex }); */
    console.log(`is it my turn? ${this.props.isMyTurn}`);
    if (this.props.isMyTurn){ //if it's user's turn, then they can change color
      this.setState({
        color: color.hex,
      }, () => {
        post("/api/game/color", {color: color.hex, game_id: this.props.game_id}).then(()=> {
          console.log("it's my turn and i'm changing the color")
        })
      });
      
    }
    
  };
  /* end of color switcher */
  render() {
    let pixels = [];
    if (this.state.pixels) {
      // let filledPixels = this.state.pixels.map((p)=>{p.filled});
      // console.log("re-rendering");
      // console.log(this.state.pixels);
      for (let i = 0; i < this.props.canvas_height_blocks * this.props.canvas_width_blocks; i++) {
        pixels.push(
          <div className="Canvas-pixelBlockContainer">
            <PixelBlock 
              hoverColor={this.state.color}
              game_id={this.props.game_id}
              actualColor={this.state.pixels[i].color}
              id={this.state.pixels[i].id} 
              filled={this.state.pixels[i].filled}
              size={this.state.block_size}
              isGuesser={this.props.isGuesser}
              isMyTurn={this.props.isMyTurn}
              /* callback={this.onPixelClicked} */
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
        <div style={{margin: "auto"}}>
          <GithubPicker width="150px" colors={this.state.colorPalette} triangle="hide" onChangeComplete={ this.handleChangeComplete } />
        </div>
      </>
    );
  }
}

export default Canvas;
