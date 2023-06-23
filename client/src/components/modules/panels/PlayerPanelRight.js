import React, { Component } from "react";
import { socket } from "../../../client-socket.js";
import { get, put } from "../../../utilities";
import "../../../utilities.css";
import GuessEntry from "../GuessEntry.js";
import "./PlayerPanel.css";
import "./PlayerPanelRight.css";

/**
 * PlayerPanelRight is the right side of the Player page, should contain a guessing 
 * for the guesser and a settings bar
 * Proptypes
 * @param game_id
 * @param _id google name
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

  componentWillUnmount () {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;
    get("api/game/get", {
      game_id: this.props.game_id,
      _id: this.props._id,
    }).then((res) => {
      if (!res) {
        console.log("game not found");
      } else {
        if (this.is_mounted) {
          this.setState({
            guesses: res.guesses,
            turn: res.turn,
          });
        }
      }
    });

    socket.on("guesses", (guesses) => {
      if (this.props.game_id === guesses.game_id && this.is_mounted){
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
        _id: this.props._id,
        guess: the_guess,
      }).then((res) => {
        // if(res.message == "correct") {
        // } else {
        // }
      }).catch((err) => {
        console.log(err);
      })
    }
    
  }

  render() {
    let guesses = []
    for (let i = this.state.guesses.length-1; i > -1 ; i--) {
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
          <div className="PlayerPanelRight-chatBoxContainer">
            <div className="PlayerPanelRight-header">
              guesses
            </div>
            <div className="PlayerPanelRight-chatBox">
              {/* <div style={{overflow: "auto"}}> */}
                {guesses}
              {/* </div> */}
            </div>
            {(this.props.isGuesser) &&
            <div className="PlayerPanelRight-guesser">
              <div className="PlayerPanelRight-guessTextEntryContainer">
                <GuessEntry 
                  className="PlayerPanelRight-guessTextEntry" 
                  game_id={this.props.game_id}
                  _id={this.props._id}
                  callback={this.onGuessEntry}
                  onSubmit={this.submitGuess}
                  />
              </div>
            </div> 
            }
          </div>
        </div>

        
            {/* <button 
              className="PlayerPanelRight-submitGuessButton u-color-1"
              onClick={this.submitGuess}
            >guess</button> */}
      </>
    );
  }
}

export default PlayerPanelRight;
