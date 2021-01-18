import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { navigate } from "@reach/router";

import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./JoinGame.css";

import { post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";
/**
 * JoinGame page asks the user to enter a unique ID, then joins
 * a game with said ID. 
 * Props are passed down from the Link in StartMenu, so we should use this.props.location.state.___ to reference.
 * @param user_id 
 * @param user_name google name
 */
class JoinGame extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);

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
    console.log("u clickd the join game button");
    post("api/game/join", {
      game_id: this.state.game_id,
      user_id: this.props.location.state.user_id,
      user_name: this.props.location.state.user_name,
    }).then((res) => {
      console.log(res);
      if (res.status == "success") {
        console.log(res);
        navigate("/lobby", {state: 
          {
            user_id: this.props.location.state.user_id,  
            user_name: this.props.location.state.user_name,  
            game_id: this.state.game_id
          }
        });
      } else {
        console.log("error, can't join game");
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ and also make responsive*/}
            {/* TODO add functionality for entering names too */}
            <div>hello, {this.props.location.state.user_name}!</div>
            <button onClick={()=>{navigate('/')}}>back</button>           
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
