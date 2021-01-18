import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./PixelBlock.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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
    };
  }

    onClick = (event) => {
      if (this.props.isGuesser || !this.props.isMyTurn) {
        return;
      }
        // event.target.style.background = (!this.state.filled) ? 
        //   'var(--pixel-color-filled)' : 
        //   'var(--pixel-color-unfilled)'
        this.setState({filled: !this.state.filled}, () => {
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
           filled: updatedGame.pixel_id_filled
          })
        }
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
    if (this.state.hover) {
      return <div 
              className="PixelBlock-body-hover" 
              style={{
                width: this.props.size, 
                height: this.props.size,
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
