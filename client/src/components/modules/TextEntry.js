import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./StartMenu.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Generic TextEntry component
 * @param callback callback function to parent component (onGuessEntry --> sets state of guess in parent)
 * @param guessesEntry (OPTIONAL) {Booolean} if textEntry came from PlayerPanelRight.js for guesses input
 * @param className the styling
 * @param onSubmit submitGuess() --> api calls to document guess in PlayerPanelRight.js
 */
class TextEntry extends Component {
  constructor(props) {
    super(props);
    if (this.props.clear) {
      this.props.cleared();
    }
    // Initialize Default State
    this.state = {
        text: "",
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
 
  }


  handleSubmit = (event) => {
    event.preventDefault();
    this.props.callback(this.state.text);

    this.props.onSubmit && this.props.onSubmit(this.state.text);
    this.setState({
      text: "",
    });
    
  };

  onTextChange = (event) => {
    
    this.setState({
      text: event.target.value,
    })
    this.props.callback(event.target.value);
  }

  render() {

    return (
      <>
        <form>
        <input
            type='text'
            value={this.state.text}
            onChange={this.onTextChange}
        />
        {/* if this textEntry is for guesses, show the button to submit */}
        {this.props.guessesEntry ? <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>: <div></div>}
        
        </form>
      </>
    );
  }
}

export default TextEntry;
