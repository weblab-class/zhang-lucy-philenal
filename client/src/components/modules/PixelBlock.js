import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./PixelBlock.css";

/**
 * PixelBlock is a single block within the canvas, the pixels that the
 * user is able to place
 *
 * Proptypes
 * @param game_id
 * @param {string} size length of each side of the square
 * @param {string} _id unique ID relative to other pixels in the same canvas
 * @param {function} callback callback function for canvas
 */
class PixelBlock extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      filled: this.props.filled,
      hover: false,
      chosenColor: "#F898A4", //what the user chooses from palette
      actualColor: this.props.actualColor, //actual pixel background
      clicked: false, 
    };
  }

    onClick = (event) => {
      console.log("clique!");
      if (this.props.disabled || this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      let chosenColor = localStorage.getItem('chosenColorHex');
      console.log(`chosen color is ${chosenColor}`);

      // double clicking on an already filled block
      if (chosenColor == this.state.actualColor) {
        console.log("filled with " + chosenColor);
        this.setState(
          {
            actualColor: "none",
            clicked: true,
            filled: false, 
          }, () => {
          this.props.callback(this.state.filled, this.props.id, this.state.actualColor)
        });

      // filling in an empty block
      } else {
        console.log(`unfilled: ${chosenColor}`);
        this.setState(
          {
            actualColor: chosenColor,
            clicked: true,
            filled: true, 
          }, () => {
          this.props.callback(this.state.filled, this.props.id, this.state.actualColor)
        });
      }

    };

    onHover = (event) => {
      let chosenColor = localStorage.getItem('chosenColorHex');
      this.setState({chosenColor: chosenColor});
      if (this.props.disabled || this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      this.setState({hover: true});
    };

    onNonHover = (event) => {
      // let chosenColor = localStorage.getItem('chosenColorHex');
      // this.setState({chosenColor: chosenColor});
      if (this.props.disabled || this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      this.setState({hover: false});
    };

  componentDidMount() {
    // remember -- api calls go here!
    
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        if (this.props.id === updatedGame.pixel_id) { //if the change was made to this pixel
          console.log("this pixel is changed -- socket works for PixelBlock!");
          this.setState({
           filled: updatedGame.pixel_id_filled,
           actualColor: updatedGame.pixel_color,
          })
        }
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id) { //if the game id sent out is ours
        this.setState({
          filled: false,
          actualColor: "#FFFFFF",
        },()=>{})
      }
    });

    socket.on("nextWord", (updatedGame) =>{
      if (this.props.game_id === updatedGame.game_id) {
        // clear the canvas
        this.setState({
          filled: false,
          actualColor: "#FFFFFF",
        });
      }
    });

  }

  render() {
    if (this.state.chosenColor){
      if (this.state.hover) {
        return <div 
                className="PixelBlock-body-hover" 
                style={{
                  width: this.props.size, 
                  height: this.props.size,
                  backgroundColor: this.state.chosenColor.concat("7F"),
                }}
                onMouseOver={this.onHover}
                onMouseLeave={this.onNonHover}
                onMouseDown={this.onClick}
              ></div>
      } else {
        return (
          <>
            {(this.state.filled) ? 
              <div 
                className="PixelBlock-body-filled" 
                style={{
                  width: this.props.size, 
                  height: this.props.size,
                  backgroundColor: this.state.actualColor, //my actual color
                }}
                onMouseOver={this.onHover}
                onMouseLeave={this.onNonHover}
                onMouseDown={this.onClick}
              ></div> :
              <div 
                className="PixelBlock-body-unfilled" 
                style={{
                  width: this.props.size, 
                  height: this.props.size,
                  backgroundColor: "#FFFFFF"
                }}
                onMouseOver={this.onHover}
                onMouseLeave={this.onNonHover}
                onMouseDown={this.onClick}
              ></div>
            }
          </>
        );
      }
    } else {
<<<<<<< HEAD
      return null
=======
      return <div 
                className="PixelBlock-body-unfilled" 
                style={{
                  width: this.props.size, 
                  height: this.props.size,
                  backgroundColor: "#FFFFFF"
                  // backgroundColor: this.state.chosenColor.concat("7F"),
                }}
                onMouseOver={this.onHover}
                onMouseLeave={this.onNonHover}
                onMouseDown={this.onClick}
              ></div>    
>>>>>>> 618cc3661b8891d945e7786eb229d4e0786a1a63
    }
  }
}

export default PixelBlock;
