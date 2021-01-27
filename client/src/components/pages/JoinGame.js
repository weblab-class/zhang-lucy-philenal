import { navigate } from "@reach/router";
import React, { Component } from "react";
import { post } from "../../utilities";
import "../../utilities.css";
import TextEntry from "../modules/TextEntry.js";
import "./JoinGame.css";

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
  }

  onGameIDEntry = (game_id) => {
    this.setState({game_id: game_id});
  }

  onEnterKeyPress = (game_id) => {
    this.setState({game_id: game_id}, ()=>{this.joinGame()});
  }

  joinGame = () => {
    console.log("join game!");
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
            <div className="u-welcome">hello, {this.props.location.state.user_name}!</div>
            <button onClick={()=>{navigate('/')}}>back</button>
            <div className="JoinGame-container">
                <div className="JoinGame-title">
                  join game
                  </div>
                <div className="JoinGame-rowPixel">
                  <div className="JoinGame-pixels u-color-1"></div>
                  <div className="JoinGame-pixels u-color-2"></div>
                  <div className="JoinGame-pixels u-color-3"></div>
                  <div className="JoinGame-pixels u-color-4"></div>
                </div>
                <div className="JoinGame-entireColumn">
                  <div className="JoinGame">
                      <div>
                      <div className="JoinGame-header">
                        enter the game id:
                      </div>
                      <TextEntry 
                        callback={this.onGameIDEntry}
                        onEnterKeyPress={this.onEnterKeyPress}
                      />
                      </div>
                  </div>
                  <button 
                    className="JoinGame-startGame"
                    onClick={this.joinGame}
                    disabled={this.state.game_id.length == 0}
                    >
                    join game
                  </button>
                  {/* TODO: thing below doesn't show up, instead was redirected to start page */}
                  {(this.state.game_not_found) ? 
                  <div className="u-text-error">
                  Game not found, please enter a valid game ID.
                  </div> :
                  <div></div>
                  }
                </div>
              </div>

           {/*  <div className="JoinGame-container">
              <div className="JoinGame-linkContainer">
                  <h1>Join Game </h1>
                  <p>Enter the game ID:</p>
                  <TextEntry 
                    callback={this.onGameIDEntry}
                    onEnterKeyPress={this.onEnterKeyPress}
                  />
                  <button onClick={this.joinGame} className="JoinGame-button u-color-1">join game</button>
                  {(this.state.game_not_found) && 
                    <div className="u-text-error">
                      Game not found, please enter a valid game ID.
                    </div> 
                  }
                  
              </div>

            </div> */}
      </>
    );
  }
}

export default JoinGame;
