import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./StartMenu.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class StartMenu extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="StartMenu-buttonsRow">
            <div className="StartMenu-linkContainer">
                <Link to="/skeleton" className="StartMenu-link">
                    <button className="StartMenu-button u-color-1">how to play</button>
                
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/newgame/" className="StartMenu-link">
                    <button className="StartMenu-button u-color-2">new game</button>
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/joingame/" className="StartMenu-link">
                    <button className="StartMenu-button u-color-3">join game</button>
                </Link>
            </div>
            <div className="StartMenu-linkContainer">
                <Link to="/wall/" className="StartMenu-link">
                    <button className="StartMenu-button u-color-4">my wall</button>
                </Link>
            </div>
        </div>
      </>
    );
  }
}

export default StartMenu;
