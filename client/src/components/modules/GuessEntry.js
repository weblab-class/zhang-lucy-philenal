import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./GuessEntry.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Generic GuessEntry component
 * @param callback callback function to parent component (onGuessEntry --> sets state of guess in parent)
 * @param className the styling
 * @param onSubmit submitGuess() --> api calls to document guess in PlayerPanelRight.js
 */
class GuessEntry extends Component {
  constructor(props) {
    super(props);
    if (this.props.clear) {
      this.props.cleared();
    }
    // Initialize Default State
    this.state = {
        text: "",
        disableButton: false,
        areYouSure: false,
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

  onCorrectGuess = (event) => {
    // TODO
  }

  onKeyPress = (event) => {
    if(event.key === 'Enter'){
      console.log('enter press here! ')
      this.handleSubmit(event);
    }
  }

  onTextChange = (event) => {
    this.setState({
      text: event.target.value,
    })
    this.props.callback(event.target.value);
  }

  onQuitConfirmation = (event) => {
      this.setState({
          areYouSure: true,
      })
  }

  onQuit = (event) => {
      // TODO!!
  }

  render() {

    return (
      <>
        <div className="GuessEntry-container">
            {/* <form> */}
                <div className="GuessEntry-child">
                    <input
                        type='text'
                        value={this.state.text}
                        onChange={this.onTextChange}
                        onKeyPress={this.onKeyPress}
                    />
                </div>
                <div className="GuessEntry-child">
                    <button
                        type="submit"
                        className="NewPostInput-button u-pointer"
                        value="Submit"
                        onClick={this.handleSubmit}
                        disabled={this.state.disableButton}
                    >submit
                    </button>
                </div>
                <div className="GuessEntry-child">
                    <button
                        type="submit"
                        className="NewPostInput-button u-pointer"
                        value="Submit"
                        onClick={this.onQuitConfirmation}
                        disabled={this.state.areYouSure}
                    >give up
                    </button>
                </div>
            {/* </form> */}
        </div>
        {this.state.areYouSure && 
        
        <div className="GuessEntry-quitConfirmationContainer">
            <div className="GuessEntry-quitConfirmationChild">
                are you sure?
            </div>
            <div className="GuessEntry-quitConfirmationChild">
                <button onClick={this.onQuit}>
                    yes, I give up
                </button>
            {/* </div>
            <div className="GuessEntry-quitConfirmationChild"> */}
                <button onClick={()=>{this.setState({areYouSure: false})}}>
                    cancel
                </button>
            </div>
        </div>}

      </>
    );
  }
}

export default GuessEntry;
