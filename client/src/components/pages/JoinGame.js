import { navigate } from "@reach/router";
import React, { Component } from "react";
import { post } from "../../utilities";
import TextEntry from "../modules/TextEntry.js";
import "./JoinGame.css";
import MadeWithLuv from "../modules/MadeWithLuv.js";
import ToggleButton from "../modules/ToggleButton";

/**
 * JoinGame page asks the user to enter a unique ID, then joins
 * a game with said ID. 
 * Props are passed down from the Link in StartMenu, so we should use this.props.location.state.___ to reference.
 * @param _id 
 * @param user_name google name
 */
class JoinGame extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      game_id: "",
      game_not_found: false,
      button_disabled: false,
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
    this.setState({button_disabled: true});
    post("api/game/join", {
      game_id: this.state.game_id,
      _id: this.props.location.state._id,
      user_name: this.props.location.state.user_name,
    }).then((res) => {
      if (res.status == "success") {
        navigate("/lobby", {state: 
          {
            _id: this.props.location.state._id,  
            user_name: this.props.location.state.user_name,  
            game_id: this.state.game_id
          }
        });
      } else if (res.status == "error" && res.msg == "game already started") {
        navigate("/gamealreadystarted");
      }
      else {
        console.log("error, can't join game");
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  render() {
    return (
      <>
            <div className="u-welcome">
              <div>
              hello, {this.props.location.state.user_name}!
              </div>
              <div>
              <ToggleButton/>
              </div>
            </div>
            <div className="u-back-button-container">
              <button onClick={()=>{navigate('/')}}>back</button>
            </div>
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
                    disabled={this.state.game_id.length == 0 || this.state.button_disabled}
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
              <MadeWithLuv />
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
