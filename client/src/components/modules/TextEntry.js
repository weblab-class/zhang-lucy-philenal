import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./StartMenu.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Generic TextEntry component
 * @param callback callback function to parent component
 * @param clear boolean that says if you can clear the text
 * @param cleared calls the textCleared function to set clear: false
 * @param className the styling
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
    if (this.props.clear) {
      this.props.cleared();
    }
  }

  clear = () => {
    console.log("clearing...");
    this.setState({text: ""});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.callback(event.target.value).then(()=>{
      this.props.onSubmit && this.props.onSubmit(this.state.text);
      this.setState({
        text: "",
      });
    })
    
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
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
        </form>
      </>
    );
  }
}

export default TextEntry;
