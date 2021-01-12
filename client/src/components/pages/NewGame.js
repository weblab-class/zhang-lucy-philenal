import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
// import "./NewGame.css";

import { get, post } from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * NewGame page asks the user to enter a unique ID, then creates
 * a game with said ID.
 * @param user_id 
 */
class NewGame extends Component {
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
    this.setState({game_id: game_id}, () => {
      console.log(`Game ID: ${game_id}`)
    });
    
  }

  newGame = (event) => {
    console.log("calling API rn");
    // TODO (lucy?): API call to check if game ID is valid, new game if yes
    post("/api/game/new", {game_id: this.state.game_id})
    .then((res) => {
      console.log("new game");
      console.log(res);
    });    
  }

  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="NewGame-linkContainer">
                <h1>New Game </h1>
                <p>Enter a game ID:</p>
                <TextEntry callback={this.onGameIDEntry}/>
                <Link to="/" onClick={this.newGame} className="NewGame-link">
                    <button 
                      className="NewGame-button u-color-1"
                      // onClick={this.newGame}
                    >make game</button>
                </Link>
            </div>

      </>
    );
  }
}

export default NewGame;
