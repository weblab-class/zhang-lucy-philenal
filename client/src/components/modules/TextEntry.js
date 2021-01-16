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

  onTextChange = (event) => {
    this.props.callback(event.target.value);
  }

  render() {

    return (
      <>
        <form>
        <input
            type='text'
            onChange={this.onTextChange}
        />
        </form>
      </>
    );
  }
}

export default TextEntry;
