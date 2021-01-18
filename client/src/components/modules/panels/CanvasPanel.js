import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../../client-socket.js";
import "./PlayerPanel.css";
// import "./CanvasPanel.css";
import Canvas from "../Canvas.js";
import { post } from "../../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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
      num_filled: num_filled,
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
    })

    
  }

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
      post("/api/game/endTurn",
      {
        game_id: this.props.game_id
      }).then((game) =>
      {
        console.log("You ended your turn. Now the turn number is " + game.turn)
      })
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
              isMyTurn={this.props.isMyTurn}
              callback={this.props.isGuesser ? null: this.onPixelClicked}
            />
            <div className="CanvasPanel-footer">
              {/* pixels remaining: {this.state.num_filled} */}
              <div className="CanvasPanel-child">
                pixels filled: {this.state.num_filled}
              </div>
              {console.log(this.props.isMyTurn && !this.props.isGuesser)}
              {/* if it's your turn and you're not the guesser, then show the end turn button */}
              
              <div className="CanvasPanel-child">
                {this.props.correctGuess && <span style={{color: "#25e859"}}>correct!</span>}
              </div>
              <div className="CanvasPanel-child">
                {(this.props.isMyTurn && !this.props.isGuesser) ? <button onClick={this.endTurn} className="CanvasPanel-button u-color-1">end turn</button>: <div></div>}
              </div>

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
