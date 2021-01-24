import React, { Component } from "react";
import { GithubPicker } from 'react-color';
import reactCSS from 'reactcss';
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../../client-socket.js";
import TransitionsModal  from "../TransitionsModal.js";
import AlertDialog  from "../AlertDialog.js";
import "./PlayerPanel.css";
import "./CanvasPanel.css";
import "../Canvas.css";
// import "./CanvasPanel.css";
import Canvas from "../Canvas.js";
import { post } from "../../../utilities";



/**
 * The CanvasPanel is the entire middle panel below the title, containing the Canvas
 * @param game_id
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param canvas_pixels array of pixel objects in the canvas
 * @param isGuesser - Boolean if player is guesser
 * @param isMyTurn - Boolean if it is player's turn
 */
class CanvasPanel extends Component {
  constructor(props) {
    super(props);
    //TODO: fix the pixels filled!!
    let num_filled = 0;
    for (let i = 0; i < this.props.canvas_pixels.length; i++) {
      if (this.props.canvas_pixels[i].filled) {
        num_filled += 1;
      };
    }

    // Initialize Default State
    this.state = {
      overlayText: "",
      num_filled: num_filled,
      theWordWas: "",
      background: '#F898A4',
      colorPalette: ['#F898A4', '#FCDA9C', '#F7FAA1', '#B4F6A4', '#9BE0F1', '#A2ACEB', '#ffffff', '#ece0d1', '	#e0a899', '#aa6f73', '#a39193', '#66545e'],
    };
  }

  componentDidMount() {
    socket.on("board_and_game_id", (updatedGame) => { //if it's not my turn and someone drew a pixel
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        if (!this.props.isMyTurn) { 
          this.setState({
            num_filled: updatedGame.board.num_filled,
          })
        }
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id) { //if the game id sent out is ours
        this.setState({
          num_filled: updatedGame.board.num_filled,
          pixels: updatedGame.board.pixels
        });
      }
    });

    socket.on("correct_guess", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          overlayText: "correct!",
          theWordWas: updatedGame.theWordWas
        });
      }
    });

    socket.on("textOverlay", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          overlayText: updatedGame.textOverlay,
          theWordWas: updatedGame.theWordWas
        });
      }
    });
    
  }

  /* color switcher */
  handleColorChange = (color, event) => {
    /* this.setState({ background: color.hex }); */
    console.log("chanigng color");
    console.log(color);
    if (this.props.isMyTurn){ //if it's user's turn, then they can change color
      localStorage.setItem('chosenColorHex', color.hex);
    }
  };
  /* end of color switcher */

  onPixelClicked = (filled) => {
    if (filled) {
      this.setState({num_filled: this.state.num_filled + 1});
    } else {
      this.setState({num_filled: this.state.num_filled - 1});
    }
  }

  endTurn = () => {
    //get and then post
    //TODO: write this function -- also change the isGuesser param to canvas to isMyTurn
    if (this.props.game_id){
      // end turn
      post("/api/game/endTurn",
      {
        game_id: this.props.game_id,
        user_id: this.props.user_id,
      }).then((game) =>
      {
        console.log("You ended your turn. Now the turn number is " + game.turn)
      }).catch((err) => {
        console.log(err);
      });
    }
    
  }

  updateOverlayText = (text) => {
    this.setState({overlayText: text});
  }

  nextWord = () => {
    post("api/game/nextRound", 
    {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((game) => {
      // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      console.log("Next word is " + game.word);
    });

    
    post("/api/board/save", { // save canvas to each user and to canvas db
      user_ids: [],
      img_id: null,
      game_id: this.props.game_id,

    }).then((res) => {
      console.log("I SAVED MY BOARD " + res);
    }).catch((err) => {
      console.log(err);
    });

    post("/api/board/clear_pixels", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      if (res && res.board) {
        console.log("I CLEARED MY PIXELS")
        this.setState({pixels: res.board.pixels});
      }
    }).catch((err) => {
      console.log(err);
    })

  }

  render() {
    return (
      <>
      {/* <TransitionsModal 
        overlayText={this.state.overlayText} 
        theWordWas={this.state.theWordWas}
        callback={this.nextWord}
        callbackButtonText={"next word"}
      /> */}
      <AlertDialog 
        isGuesser={this.props.isGuesser}
        overlayText={this.state.overlayText} 
        theWordWas={this.state.theWordWas}
        callback={this.nextWord}
        callbackButtonText={"next word"}
      />
        <div className="CanvasPanel">
          <div className="CanvasPanel-bigBigContainer">
            <div className="CanvasPanel-bigContainer">
              <div className="CanvasPanel-canvasContainer">
                <Canvas 
                  background={this.state.background}
                  canvas_height_blocks={this.props.canvas_height_blocks} 
                  canvas_width_blocks={this.props.canvas_width_blocks} 
                  game_id={this.props.game_id}
                  user_id={this.props.user_id}
                  isGuesser={this.props.isGuesser}
                  isMyTurn={this.props.isMyTurn}
                  onPixelClicked={this.props.isGuesser ? null: this.onPixelClicked}
                  // updateOverlayText={this.updateOverlayText}
                />
              </div>
          </div>
          
           
          </div>
          <div className="CanvasPanel-footer">
              {(this.props.isMyTurn && !this.props.isGuesser) && 
              <div>
                <div className="CanvasPanel-child">
                  pixels filled: {this.state.num_filled}
                </div>
                <div className="CanvasPanel-child">
                <GithubPicker 
                  width="150px" 
                  colors={this.state.colorPalette} 
                  triangle="hide" 
                  onChangeComplete={ this.handleColorChange } 
                />
                </div>                
              </div>
              }
              <div className="CanvasPanel-child">
                {this.props.correctGuess && <span style={{color: "#25e859"}}>correct!</span>}
              </div>
              <div className="CanvasPanel-child">
                {(this.props.isMyTurn && !this.props.isGuesser) && 
              <div>
              <div className="CanvasPanel-child">
                <button 
                  onClick={this.endTurn} 
                  className="Canvas-footer-button u-pointer" 
                >end turn
                </button>
              </div>
              <div className="CanvasPanel-child">
                <button 
                  className="Canvas-footer-button u-pointer" 
                  onClick={this.props.clearCanvas}
                >
                  clear canvas
                </button>
              </div>
              </div>

                }
                
               {/*  {this.props.isGuesser &&
                  <button 
                    className="Canvas-footer-button u-pointer" 
                    onClick={this.nextWord}
                  >
                    next word
                  </button>
                } */}
              </div>

            </div>
        </div>

      </>
    );
  }
}

export default CanvasPanel;
