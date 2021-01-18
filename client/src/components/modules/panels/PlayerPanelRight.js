import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";
import { socket } from "../../../client-socket.js";

import TextEntry from "../TextEntry.js";
import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelRight.css";

import { get, put} from "../../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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
      guess: null
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("api/game/get", {game_id: this.props.game_id})
    .then((res) => {
      if (res.length == 0) {
        console.log("rip");
      } else {
        this.setState({guesses: res[0].guesses});
      }
    })
    socket.on("guess", (guesses) => {
      this.setState({
        guesses: guesses.guesses,
      })
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
          this.props.callback(the_guess);
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
          Guesses
          <div className="PlayerPanelRight-chatBox">
            {guesses}
          </div>
          {(!this.props.isGuesser) &&
          <div className="PlayerPanelRight-guesser">
            <div className="PlayerPanelRight-guessTextEntryContainer">
              <TextEntry 
                guessesEntry={true} //TODO: unhardcode later?
                className="PlayerPanelRight-guessTextEntry" 
                callback={this.onGuessEntry}
                onSubmit={this.submitGuess}/>
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
