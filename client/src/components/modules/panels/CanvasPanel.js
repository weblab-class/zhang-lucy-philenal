import React, { Component } from "react";
import { GithubPicker } from 'react-color';
import { socket } from "../../../client-socket.js";
import { post } from "../../../utilities";
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
 * @param user_id
 * @param canvas_width_blocks the width of the canvas in blocks
 * @param canvas_height_blocks the height of the canvas in blocks
 * @param canvas_pixels array of pixel objects in the canvas
 * @param pixel_limit maximum pixels that a player can put
 * @param isGuesser - Boolean if player is guesser
 * @param isMyTurn - Boolean if it is player's turn
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
      user_name: null,
      overlayText: "",
      num_filled: num_filled,
      almostEnd: false,
      theWordWas: "",
      background: '#F898A4',
      colorPalette: ['#F898A4', '#FCDA9C', '#F7FAA1', '#B4F6A4', '#9BE0F1', '#A2ACEB', '#ffffff', '#ece0d1', '	#e0a899', '#aa6f73', '#a39193', '#66545e'],
      endGame: false,
      scoreText:"",
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
        console.log("ALMOST ENDED ? " + res.almostEnd)
        this.setState({almostEnd: true})
      }
      window.location.reload();

    })

    //if game ended, show the pop up!!
    socket.on("endGame", (endGame) => {
        if (this.props.game_id === endGame.game_id) {
            console.log("GAME ENDED")
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
      this.setState({num_filled: this.state.num_filled + 1});
    } else {
      this.setState({num_filled: this.state.num_filled - 1});
    }
  }

  endTurn = () => {
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
          user_id: this.props.user_id,
        }).then((res) => {
          if (res && res.board) {
            console.log("I CLEARED MY PIXELS")
            this.setState({pixels: res.board.pixels});
            
            window.location.reload();
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    });
  }

  render() {
    if (this.state.num_filled && this.props.pixel_limit) {}
      console.log(`Pixel Limit: ${this.props.pixel_limit}`);
      console.log(`Num Filled: ${this.state.num_filled}`);
      let pixels_remaining = this.props.pixel_limit - this.state.num_filled;
      return (
        <>
        {/* show this only if at end of game */}
        {this.state.scoreText.length !== 0 && 
        <AlertDialog
          endGame={this.state.endGame}
          overlayText={this.state.overlayText}
          theWordWas={this.state.scoreText}
          user_id={this.props.user_id}
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
        user_id={this.props.user_id}
        game_id={this.props.game_id}
        callbackButtonText={this.state.almostEnd ? "end game": "next word"}
      />}
        
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
                    pixels_remaining={pixels_remaining}
                    pixel_limit={this.props.pixel_limit}
                    onPixelClicked={this.props.isGuesser ? null: this.onPixelClicked}
                  />
                </div>
            </div>
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
