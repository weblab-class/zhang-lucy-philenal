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
      actualColor: "#FFFFFF", //actual pixel background
      clicked: false, 
    };
  }

    onClick = (event) => {
      if (this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
        // event.target.style.background = (!this.state.filled) ? 
        //   'var(--pixel-color-filled)' : 
        //   'var(--pixel-color-unfilled)'
        this.setState(
          {
            actualColor: this.state.chosenColor,
            clicked: true,
            filled: !this.state.filled, 
          }, () => {
          this.props.callback(this.state.filled, this.props.id)
        });
    };

    onHover = (event) => {
      if (this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      this.setState({hover: true});
        // event.target.style.background = 'var(--pixel-color-hover)';
    };

    onNonHover = (event) => {
      if (this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      console.log("I'm not hovering!");
      this.setState({hover: false});

        // event.target.style.background = (this.state.filled) ? 
        //     'var(--pixel-color-filled)' : 
        //     'var(--pixel-color-unfilled)';
    };

  componentDidMount() {
    // remember -- api calls go here!
    socket.on("board_and_game_id", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        if (this.props.id === updatedGame.pixel_id) { //if the change was made to this pixel
          console.log("this pixel is changed -- socket works for PixelBlock!");
          this.setState({
           filled: updatedGame.pixel_id_filled,
          })
        }
      }
    });

    //listens for if the user clicks on a color, and changes our background state to that color
    socket.on("color", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          chosenColor: updatedGame.background,
        },()=>{console.log("this is my chosen color right now " + this.state.chosenColor)})
      }
    });

    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id) { //if the game id sent out is ours
        console.log("cleareddd");
        this.setState({
          filled: false,
        },()=>{console.log(this.state)})
      }
    });
  }

  render() {
    // const myCSS = css`background: ${({ myColor }) => myColor || `black`};`;
    // const MyComponent = styled('div')`${myCSS};`;
    console.log(this.state.actualColor + " is my color right now");
    if (this.state.hover) {
      return <div 
              className="PixelBlock-body-hover" 
              style={{
                width: this.props.size, 
                height: this.props.size,
                backgroundColor: this.state.chosenColor.concat("7F"), //this changes depending on color chosen
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
                backgroundColor: "white"
              }}
              onMouseOver={this.onHover}
              onMouseLeave={this.onNonHover}
              onMouseDown={this.onClick}
            ></div>
          }
        </>
      );
    }
    
  }
}

export default PixelBlock;
