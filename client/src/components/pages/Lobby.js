import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
// import "./Lobby.css";

import { get, post } from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Lobby page is what the user travels to after making/joining
 * a game. The host can start the game.
 * 
 * @param game_id
 * @param user_id 
 */
class Lobby extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/game/get", {game_id: this.props.game_id})
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
            <div className="Lobby">
                Lobby :D
            </div>

      </>
    );
  }
}

export default Lobby;
