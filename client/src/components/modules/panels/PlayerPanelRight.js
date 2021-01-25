import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";
import { socket } from "../../../client-socket.js";

import GuessEntry from "../GuessEntry.js";
import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelRight.css";

import { get, put} from "../../../utilities";


/**
 * PlayerPanelRight is the right side of the Player page, should contain a guessing 
 * for the guesser and a settings bar
 * Proptypes
 * @param game_id
 * @param user_id google name
 * @param callback function (onCorrectGuess)
 */
class PlayerPanelRight extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      guesses: [],
      guess: null,
      turn: null,
    };
  }

  // TODO: LUCY
  componentDidMount() {
    // remember -- api calls go here!
    get("api/game/get", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      if (!res) {
        console.log("game not found");
      } else {
        this.setState({
          guesses: res.guesses,
          turn: res.turn,
        });
      }
    });

    socket.on("guesses", (guesses) => {
      if (this.props.game_id === guesses.game_id){
        this.setState({
          guesses: guesses.guesses,
        })
      }
    })
  }

  onGuessEntry = (guess) => {
    this.setState({
      guess: guess,
    });
  }

  submitGuess = () => {
    if (this.state.guess){
      console.log(this.state.guess + " is the guess");
      let the_guess = this.state.guess;
      this.setState({
        clear: true, // lolrip
        guess: "", 
        guesses: this.state.guesses.concat([the_guess]),  
      });
  
      console.log(`Submitting guess for ${the_guess}...`);
      put("api/game/guess", {
        game_id: this.props.game_id,
        user_id: this.props.user_id,
        guess: the_guess,
      }).then((res) => {
        console.log(res);
        if(res.message == "correct") {
          console.log("correct!!");
          // this.props.callback(the_guess);
        } else {
          console.log(res);
          console.log("incorrect");
          // TODO: maybe hints if they are close?
        }
      }).catch((err) => {
        console.log(err);
      })
    }
    
  }

  render() {
    // TODO: cap the number of guesses
    let guesses = []
    for (let i = 0; i < this.state.guesses.length; i++) {
      guesses.push(
        <div 
          className="PlayerPanelRight-chatMessage"
        >{this.state.guesses[i]}
        </div>
      )
    }
    return (
      <>
        <div className="PlayerPanelRight">
          {this.props.isGuesser}
          <div className="PlayerPanelRight-chatBox">
            <div className="PlayerPanelRight-header">
            guesses
            </div>
            {/* <div style={{overflow: "auto"}}> */}
              <section >
              {guesses}
              </section>
            {/* </div> */}
            
            
          </div>
          {(this.props.isGuesser) &&
          <div className="PlayerPanelRight-guesser">
            <div className="PlayerPanelRight-guessTextEntryContainer">
              <GuessEntry 
                game_id={this.props.game_id}
                user_id={this.props.user_id}
                className="PlayerPanelRight-guessTextEntry" 
                callback={this.onGuessEntry}
                onSubmit={this.submitGuess}
                />
            </div>
            {/* <button 
              className="PlayerPanelRight-submitGuessButton u-color-1"
              onClick={this.submitGuess}
            >guess</button> */}
          </div> 
          }
        </div>

        
      </>
    );
  }
}

export default PlayerPanelRight;
