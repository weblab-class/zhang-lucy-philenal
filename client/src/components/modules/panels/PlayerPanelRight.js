import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelRight.css";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class PlayerPanelRight extends Component {
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
        <div className="PlayerPanelRight">
         {/*  I am the right panel! */}
          <div className="PlayerPanelRight-columnBlocks">
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/skeleton" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-1">settings</button>
                
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/newgame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-2">how to play</button>
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/joingame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-3">my wall</button>
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/newgame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-4">new game</button>
                </Link>
            </div>
        </div>
        </div>

        
      </>
    );
  }
}

export default PlayerPanelRight;
