import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelLeft.css";
import PlayerIcon from "./PlayerIcon.js";
import GuesserIcon from "./GuesserIcon.js";
import PlayerOrder from "./PlayerOrder.js";
//TODO: fix responsiveness -- for smaller screens, add margin from left
//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

//hardcoded variables

/* let turn = 0; */ //whose turn it is -- max is players.length-1 (0-indexed)

const word = "hello"


/**
 * Component to render the left panel
 *
 * Proptypes
 * @param {UserObject[]} pixelers
 * @param {Number} turn - what turn number (1, players.length) game is on
 * @param {User} guesser
 * @param {String} word
 */


class PlayerPanelLeft extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      // turn: 0,
      word: word
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    let hiddenWord = "";
    for (let i = 0; i < this.state.word.length; i++) {
      hiddenWord += "_ ";
    }
    /* let players = []
    for (let i = 0; i < players.length; i++) {
      players.push(
        <div className="PlayerPanelLeft-player">
          {players[i].playername}
        </div>
      )
    } */
    return (
      <>
        {/* TODO (philena): Make this prettier */}
        {/* TODO (philena): Add logic to change formatting to indicate whether each user is active pixeler
            or not */}
            
        <div className="PlayerPanelLeft">
          <h2>word: <span className="PlayerPanelLeft-word">{this.state.word}</span></h2>
          
          
          {/* <div className="PlayerPanelLeft-hiddenWord">{hiddenWord}</div> */} {/*  <-- use that for guesser */}
          <h2>guesser:</h2>
          
          <GuesserIcon guesser_name={this.props.guesser.name} _id={this.props.guesser._id} isMyTurn = {this.props.turn===this.props.pixelers.length ? true: false}/>
          <h2>pixelers:</h2>
          <PlayerOrder pixelers={this.props.pixelers} turn={this.props.turn}/>
        </div>
        
      </>
    );
  }
}

export default PlayerPanelLeft;
