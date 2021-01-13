import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { navigate } from "@reach/router";

import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./JoinGame.css";

import { get, post, put } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class JoinGame extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      game_id: "",
      game_not_found: false,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onGameIDEntry = (game_id) => {
    this.setState({game_id: game_id});
  }

  joinGame = () => {
    // TODO (lucy): API call to check if game ID is valid, joining if yes
    console.log("GET request");
    get("/api/game/get", {game_id: this.state.game_id})
    .then((res) => {
      console.log(this.state.game_id);
      console.log(res); // list game objects

      if (res.length == 0) {
        this.setState({game_not_found: true},
          console.log(`No game found with ID ${this.state.game_id}`)
        );
      } else {
        // make a copy
        let game = {...res[0]};

        // add our player TODO: unhardcode 
        game.players = game.players.concat([{name: "another fake", googleid: "1234"}]);
        
        console.log("PUT request");
        put("/api/game/join", {game: game, game_id: this.state.game_id})
        .then((res) => {
          console.log(res)
          navigate("/lobby", {state: {user_id: this.props.user_id, game_id: this.state.game_id}});
        })
        .catch((err) => {
          console.log(err)
        });
      }

    })
    .catch((err) => {
      console.log(err);
    });

    
  }

  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ and also make responsive*/}
            {/* TODO add functionality for entering names too */}
            <div className="JoinGame-container">
              <div className="JoinGame-linkContainer">
                  <h1>Join Game </h1>
                  <p>Enter the game ID:</p>
                  <TextEntry callback={this.onGameIDEntry}/>
                  <button onClick={this.joinGame} className="JoinGame-button u-color-1">join game</button>
                  {(this.state.game_not_found) ? 
                  <div className="u-text-error">
                  Game not found, please enter a valid game ID.
                  </div> :
                  <div></div>
                  }
                  
              </div>

            </div>
      </>
    );
  }
}

export default JoinGame;
