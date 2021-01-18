import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelLeft.css";
import PlayerIcon from "./PlayerIcon.js";
import GuesserIcon from "./GuesserIcon.js";
import PlayerOrder from "./PlayerOrder.js";
// import { turn } from "core-js/fn/array";
//TODO: fix responsiveness -- for smaller screens, add margin from left
//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";


import { get } from "../../../utilities";

//hardcoded variables

/* let turn = 0; */ //whose turn it is -- max is players.length-1 (0-indexed)

// const word = "hello"


/**
 * Component to render the left panel
 *
 * Proptypes
 * @param {UserObject[]} pixelers
 * @param {Number} turn - what turn number (0, pixelers.length) game is on
 * @param {User} guesser
 * @param {Boolean} isGuesser
 * @param {String} word* - only if isGuesser=false
 * @param {Number} wordLength* - only if isGuesser=true
 * @param leaveGame callback function
 * 
 * DIDNT ADD THE PROPS BELOW!!! THESE ARE NOT ACTUAL PROPS
 * @param {String} user_id - we can get all of the above from this
 * @param {String} game_id
 */

class PlayerPanelLeft extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    // TODO: add wordlen as a param
    console.log(this.props);
    if (this.props.isGuesser) {
      let hiddenWord = "";
      for (let i = 0; i < this.props.wordLength; i++) {
        hiddenWord += "_ ";
      }
      
      this.state = {
        wordText: hiddenWord,
        error: false,
      };
    } else {
      this.state = {
        wordText: this.props.word,
        error: false,
      };
    }

  }

  componentDidMount() {
    
  }


  render() {


    return (
      <>
        {(!this.state.error && this.props.guesser) && 
        <div className="PlayerPanelLeft">
          <button onClick={this.props.leaveGame}>leave game</button>
          <h2>word: 
            <span className="PlayerPanelLeft-word">
              {(this.props.word) ? this.props.word : this.state.wordText}
            </span>
          </h2>
          <h2>guesser:</h2>
          <GuesserIcon guesser_name={this.props.guesser.name} _id={this.props.guesser._id} isMyTurn = {this.props.turn===this.props.pixelers.length ? true: false}/>
          <h2>pixelers:</h2>
          <PlayerOrder pixelers={this.props.pixelers} turn={this.props.turn}/>
        </div>
        }
      </>
    );
  }
}

export default PlayerPanelLeft;
