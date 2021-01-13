import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link, navigate } from "@reach/router";
// import { navigate } from "@reach/router"

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
      valid: false,
      error: false,
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
    post("/api/game/new", {user_id: this.props.user_id, game_id: this.state.game_id})
    .catch((err) => {
      console.log("error")
      console.log(`error: ${err}`);
      this.setState({error: true});
    })
    .then((res) => {
      console.log("new game");
      console.log(res);
      navigate("/lobby", {user_id: this.props.user_id, game_id: this.state.game_id});
    });    
  }

  render() {
    if (false) {
      return navigate("/pixeler");
    } else {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="NewGame-container">
                <h1>New Game </h1>
                <p>Enter a game ID:</p>
                <TextEntry callback={this.onGameIDEntry}/>
                    <button 
                      className="NewGame-button u-color-1"
                      onClick={this.newGame}
                    >new game</button>
                {this.state.error ? (
                  <div className="u-text-error">Error: game ID already taken, please try again.</div>
                ): <div>no errors here [TODO: make this show an error when the above fails]</div>}
            </div>
      </>
    );
    }
  }
}

export default NewGame;
