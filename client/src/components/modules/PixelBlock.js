import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./PixelBlock.css";

import { get, post, put } from "../../utilities.js";
/**
 * PixelBlock is a single block within the canvas, the pixels that the
 * user is able to place
 *
 * Proptypes
 * @param game_id
 * @param {string} size length of each side of the square
 * @param {string} _id unique ID relative to other pixels in the same canvas
 * @param {function} callback callback function for canvas
 * @param actualColor the actual pixel background
 * @param hoverColor the color you hover iwth
 */
class PixelBlock extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      filled: this.props.filled,
      hover: false,
      chosenColor: this.props.hoverColor, //what the user chooses from palette
      actualColor: this.props.actualColor, //actual pixel background
      clicked: false, 
    };
  }

    onClick = (event) => {
      if (this.props.disabled || this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      //when you click, the pixel takes on that chosen color from the palette
      this.setState({
        actualColor: this.props.hoverColor,
        clicked: true,
        filled: true,
      }, ()=> {

        //sends info to api, where socket will send info to other ppl
        get("/api/game/get", {game_id: this.props.game_id})
      .then((res) => {
        if (res.length == 0) {
          this.setState({game_not_found: true},
            console.log(`No game found with ID ${this.props.game_id}`)
          );
        } else {
          // make a copy
          let game = {...res[0]};
          // add our pixel
          // TODO: fix color
          game.board.num_filled = game.board.num_filled + 1;
          game.board.pixels[this.props.id] = 
          {
            id: this.props.id,
            _id: res[0].board.pixels[this.props.id]._id, 
            color: this.state.actualColor, //if it has been filled, change it to the color chosen
            filled: this.state.filled,
          };
          put("/api/game/pixel", 
          {
            pixel_id: this.props.id,
            pixel_id_filled: this.state.filled,
            pixel_color: this.state.actualColor,
            game: game, 
            game_id: this.props.game_id
          })
          .then((res) => {
            // console.log("response");
            console.log(res);
          })
          .catch((err) => {
            console.log(err)
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
      });

      
    
        // if (this.state.chosenColor == this.state.actualColor) {
        //   console.log("filled with " + this.state.chosenColor);
        //   this.setState(
        //     {
        //       actualColor: this.state.chosenColor,
        //       clicked: true,
        //       filled: false, 
        //     }, () => {
        //     this.props.callback(this.state.filled, this.props.id, this.state.actualColor)
        //   });
        // } else {
        //   console.log("unfilled");
        //   this.setState(
        //     {
        //       actualColor: "none",
        //       clicked: true,
        //       filled: true, 
        //     }, () => {
        //     this.props.callback(this.state.filled, this.props.id, this.state.actualColor)
        //   });
        // }

    };

    onHover = (event) => {
      if (this.props.disabled || this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
      this.setState({hover: true});
    };

    onNonHover = (event) => {
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

    //listens for if the user clicks on a color, and changes our background state to that color
    /* socket.on("color", (updatedGame) => {
      if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
        this.setState({
          chosenColor: updatedGame.background,
        },()=>{console.log("this is my chosen color right now " + this.state.chosenColor)})
      }
    }); */

 /*    socket.on("cleared_canvas", (updatedGame) => {
      if (this.props.game_id === updatedGame._id) { //if the game id sent out is ours
        this.setState({
          filled: false,
          color: "none",
        },()=>{})
      }
    }); */

  }

  render() {
    // const myCSS = css`background: ${({ myColor }) => myColor || `black`};`;
    // const MyComponent = styled('div')`${myCSS};`;
    // console.log(this.state.actualColor + " is my color right now");
    if (this.state.hover) {
      return <div 
              className="PixelBlock-body-hover" 
              style={{
                width: this.props.size, 
                height: this.props.size,
                backgroundColor: this.props.hoverColor.concat("7F"), //this changes depending on color chosen
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
    
  }
}

export default PixelBlock;
