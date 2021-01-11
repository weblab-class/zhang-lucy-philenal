import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./PixelBlock.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * PixelBlock is a single block within the canvas, the pixels that the
 * user is able to place
 *
 * Proptypes
 * @param {string} size length of each side of the square
 */
class PixelBlock extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      filled: false,
    };
  }

    onClick = (event) => {
        event.target.style.background = (!this.state.filled) ? 
        'var(--pixel-color-filled)' : 
        'var(--pixel-color-unfilled)'
        this.setState({filled: !this.state.filled}, () => {});
    };

    onHover = (event) => {
        event.target.style.background = 'var(--pixel-color-hover)';
    };

    onNonHover = (event) => {
        event.target.style.background = (this.state.filled) ? 
            'var(--pixel-color-filled)' : 
            'var(--pixel-color-unfilled)';
    };

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    // const myCSS = css`background: ${({ myColor }) => myColor || `black`};`;
    // const MyComponent = styled('div')`${myCSS};`;
    return (
      <>
        <div 
            className="PixelBlock-body" 
            style={{width: this.props.size, height: this.props.size}}
            onMouseOver={this.onHover}
            onMouseLeave={this.onNonHover}
            onClick={this.onClick}
        >
        </div>
      </>
    );
  }
}

export default PixelBlock;
