import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { navigate } from "@reach/router";
// import { navigate } from "@reach/router"

import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./NewGame.css";

import { get, post } from "../../utilities";



/**
 * NewGame page asks the user to enter a unique ID, then creates
 * a game with said ID. 
 * Props are passed down from the Link in StartMenu, so we should use this.props.location.state.___ to reference.
 * @param user_id 
 * @param user_name google name
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
    console.log(this.props);
  }

  onGameIDEntry = (game_id) => {
    this.setState({game_id: game_id});
  }
  
  onEnterKeyPress = (game_id) => {
    this.setState({
      final_game_id: game_id, game_id: game_id
    }, ()=>{this.newGame()});
  }

  // TODO (lucy): get rid of GET request
  newGame = (event) => {
    post("/api/game/new", {
      user_id: this.props.location.state.user_id, 
      user_name: this.props.location.state.user_name, 
      game_id: this.state.game_id,
    })
    .then((res) => {
      if (res.status == "success") {
        console.log("new game");
        console.log(res);
        navigate("/lobby", {state: {
          user_id: this.props.location.state.user_id,  
          user_name: this.props.location.state.user_name,  
          game_id: this.state.game_id
        }});
      } else {
        console.log(`Error: ${res.msg}`);
        this.setState({error: true});
      }
      
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      this.setState({error: true});
    }); 
     
  }

  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div>hello, {this.props.location.state.user_name}!</div>
            <button onClick={()=>{navigate('/')}}>back</button>

            <div className="NewGame-container">

                <h1>New Game </h1>
                <p>Enter a game ID:</p>
                <TextEntry 
                  callback={this.onGameIDEntry}
                  onEnterKeyPress={this.onEnterKeyPress}
                />
                    <button 
                      className="NewGame-button u-color-1"
                      onClick={this.newGame}
                    >new game</button>
                {this.state.error && (
                  <div className="u-text-error">Error: game ID {this.state.final_game_id} already taken, please try again.</div>
                )}
            </div>
      </>
    );
    
  }
}

export default NewGame;
