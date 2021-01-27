import { navigate } from "@reach/router";
import React, { Component } from "react";
import { post } from "../../utilities";
import "../../utilities.css";
import TextEntry from "../modules/TextEntry.js";
import "./NewGame.css";
import MadeWithLuv from "../modules/MadeWithLuv.js";
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
      button_disabled: false,
    };
  }

  componentDidMount() {
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

  newGame = (event) => {
    this.setState({button_disabled: true});

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
            <div className="u-welcome">hello, {this.props.location.state.user_name}!</div>
            <button onClick={()=>{navigate('/')}}>back</button>
            <div className="NewGame-container">
                <div className="NewGame-title">
                  new game
                  </div>
                <div className="NewGame-rowPixel">
                  <div className="NewGame-pixels u-color-1"></div>
                  <div className="NewGame-pixels u-color-2"></div>
                  <div className="NewGame-pixels u-color-3"></div>
                  <div className="NewGame-pixels u-color-4"></div>
                </div>
                <div className="NewGame-entireColumn">
                  <div className="NewGame">
                      <div>
                      <div className="NewGame-header">
                        enter a game id:
                      </div>
                      <TextEntry 
                        callback={this.onGameIDEntry}
                        onEnterKeyPress={this.onEnterKeyPress}
                      />
                      </div>
                  </div>
                  <button 
                    className="NewGame-startGame"
                    onClick={this.newGame}
                    disabled={this.state.game_id.length == 0 || this.state.button_disabled}
                    >
                    new game
                  </button>
                  {this.state.error && (
                    <div className="u-text-error">
                      Error: game ID {this.state.final_game_id} already taken, please try again.
                    </div>
                  )}
                </div>
              </div>
              <MadeWithLuv />
      </>
    );
    
  }
}

export default NewGame;
