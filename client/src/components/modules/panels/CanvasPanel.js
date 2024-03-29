import React, { Component } from "react";
import { GithubPicker } from 'react-color';
import { socket } from "../../../client-socket.js";
import { get, post } from "../../../utilities";
import AlertDialog from "../AlertDialog.js";
import "../Canvas.css";
import Canvas from "../Canvas.js";
import "./CanvasPanel.css";
import "./PlayerPanel.css";

/**
 * The CanvasPanel is the entire middle panel below the title, containing the Canvas
 * No API calls on mount, passes props to Canvas
 * Calls endTurn when button pressed
 * 
 * @param game_id
 * @param _id
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param pixel_limit maximum pixels that a player can put
 * @param isGuesser - Boolean if player is guesser
 * @param isMyTurn - Boolean if it is player's turn
 */
class CanvasPanel extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      user_name: null,
      overlayText: "",
      num_filled: 0,
      almostEnd: false,
      theWordWas: "",
      background: '#F898A4',
      colorPalette: ['#F898A4', '#FCDA9C', '#F7FAA1', '#B4F6A4', '#9BE0F1', '#A2ACEB', '#e4e3d5', '#ece0d1', '	#e0a899', '#aa6f73', '#a39193', '#66545e'],
      endGame: false,
      scoreText:"",
    };
  }

  componentDidMount() {
    get("/api/game/num_filled", {
      game_id: this.props.game_id,
      _id: this.props._id,
    }).then((res) => {
      this.setState({num_filled: res.num_filled});
    }).catch((err) => {
      console.log(`Error: ${err}`);
    })

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
          pixels: updatedGame.board.pixels,
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

    //incorrect guess text
    socket.on("textOverlay", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          overlayText: updatedGame.textOverlay,
          theWordWas: updatedGame.theWordWas
        });
      }
    });

    //check if game is almost ending so that next button is actually end game button
    socket.on("nextWord", (res) => {
      
      if (res.almostEnd) {
        this.setState({almostEnd: true})
      }
      window.location.reload();

    })

    //if game ended, show the pop up!!
    socket.on("endGame", (endGame) => {
        if (this.props.game_id === endGame.game_id) {
            this.setState({
                endGame: true,
                overlayText: `Score: ${endGame.score.toString()}%`,
                scoreText: "you got: " + endGame.num_correct.toString() + " correct, " + endGame.num_incorrect.toString() + " wrong"
        })
        }
    })
    
  }

  /* color switcher */
  handleColorChange = (color, event) => {
    if (this.props.isMyTurn){ 
      localStorage.setItem('chosenColorHex', color.hex);
    }
  };
  /* end of color switcher */

  onPixelClicked = (filled) => {
    if (filled) {
      if (this.state.num_filled == undefined) {
        this.setState({num_filled: 1});
      }
      this.setState({num_filled: this.state.num_filled + 1});
    } else {
      if (this.state.num_filled == undefined) {
        this.setState({num_filled: 0});
      }
      this.setState({num_filled: this.state.num_filled - 1});
    }
  }

  endTurn = () => {
    if (this.props.game_id){
      // end turn
      post("/api/game/endTurn",
      {
        game_id: this.props.game_id,
        _id: this.props._id,
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
      _id: this.props._id,
    }).then((game) => {
      if (game.status == "end") {
      } else {
        //only clear pixels + reload if not end of game
        //to change the button to show "end game"
        if (game.almostEnd) {
          this.setState({
            almostEnd: true,
          })
        }
        console.log("Next word is " + game.word);
        post("/api/board/clear_pixels", {
          game_id: this.props.game_id,
          _id: this.props._id,
        }).then((res) => {
          if (res && res.board) {
            console.log("I CLEARED MY PIXELS")
            this.setState({pixels: res.board.pixels}, ()=>{
              window.location.reload();
            });
            
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    });
  }

  render() {
      let pixels_remaining = 0;
      console.log(`Pixel Limit: ${this.props.pixel_limit}`);
      console.log(`Num Filled: ${this.state.num_filled}`);
      if (this.state.num_filled == undefined) {
        this.setState({num_filled: 0});
      } else {
        pixels_remaining = this.props.pixel_limit - this.state.num_filled;
      }
      return (
        <>
        {/* show this only if at end of game */}
        {this.state.scoreText.length !== 0 && 
        <AlertDialog
          endGame={this.state.endGame}
          overlayText={this.state.overlayText}
          theWordWas={this.state.scoreText}
          _id={this.props._id}
          user_name={this.state.user_name}
          game_id={this.props.game_id}
          isGuesser={this.props.isGuesser}
          />}
          {/* only show this if not end of game */}
        {this.state.scoreText.length === 0 && 
        <AlertDialog 
        endGame={this.state.endGame}
        isGuesser={this.props.isGuesser}
        overlayText={this.state.overlayText} 
        theWordWas={this.state.theWordWas}
        callback={this.nextWord}
        _id={this.props._id}
        game_id={this.props.game_id}
        callbackButtonText={this.state.almostEnd ? "end game": "next word"}
      />}
        
          <div className="CanvasPanel">
            <div className="CanvasPanel-canvasContainer">
              <Canvas 
                background={this.state.background}
                canvas_height_blocks={this.props.canvas_height_blocks} 
                canvas_width_blocks={this.props.canvas_width_blocks} 
                game_id={this.props.game_id}
                _id={this.props._id}
                isGuesser={this.props.isGuesser}
                isMyTurn={this.props.isMyTurn}
                pixels_remaining={pixels_remaining}
                pixel_limit={this.props.pixel_limit}
                onPixelClicked={this.props.isGuesser ? null: this.onPixelClicked}
              />
            </div>
            <div className="CanvasPanel-footer">
                {(this.props.isMyTurn && !this.props.isGuesser) && 
                <div>
                  <div className="CanvasPanel-child">
                    {pixels_remaining!=null && 
                    <div>pixels remaining: {pixels_remaining}</div>}
                  </div>
                  <div className="CanvasPanel-child">
                  {(pixels_remaining > 0)?
                    <GithubPicker 
                      width="150px" 
                      colors={this.state.colorPalette} 
                      triangle="hide" 
                      onChangeComplete={ this.handleColorChange } 
                    /> :
                    <div>You have used all your pixels; remove a pixel to add more.</div>
                  }
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
                </div>
              </div>
          </div>
        </>
      );
    }
  
}

export default CanvasPanel;
