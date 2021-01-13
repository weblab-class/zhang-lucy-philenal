import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
// import "./JoinGame.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class JoinGame extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      game_id: "",
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onGameIDEntry = (game_id) => {
    console.log(`Game ID: ${game_id}`);
  }

  joinGame = () => {
    // TODO (lucy?): API call to check if game ID is valid, joining if yes
    console.log("PUT request");
    
    
  }

  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="JoinGame-linkContainer">
                <h1>Join Game </h1>
                <p>Enter the game ID:</p>
                <TextEntry callback={this.onGameIDEntry}/>
                <button className="JoinGame-button u-color-1">join game</button>
            </div>

      </>
    );
  }
}

export default JoinGame;
