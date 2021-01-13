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
const playersList = [
  {
  playername: "Lucy",
  _id: 1
},
{
  playername: "Bob",
  _id: 2
},
{
  playername: "Bob",
  _id: 3
},
{
  playername: "Bob",
  _id: 4
}
];

const guesser = {
  playername: "Me",
  _id: 0
};

let turn = 0; //whose turn it is -- max is playersList.length-1 (0-indexed)

const word = "hello"

class PlayerPanelLeft extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
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
    for (let i = 0; i < playersList.length; i++) {
      players.push(
        <div className="PlayerPanelLeft-player">
          {playersList[i].playername}
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
          <GuesserIcon guessername={guesser.playername} _id={guesser._id} isMyTurn = {turn==playersList.length ? true: false}/>
          <h2>pixelers:</h2>
          {/* {players} */}
          <PlayerOrder players={playersList} turn={turn}/>
        </div>
        
      </>
    );
  }
}

export default PlayerPanelLeft;
