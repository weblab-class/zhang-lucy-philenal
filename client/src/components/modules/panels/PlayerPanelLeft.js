import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";
import PlayerIcon from "./PlayerIcon.js";
import PlayerOrder from "./PlayerOrder.js";

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

const word = "hello"

class PlayerPanelLeft extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
      let i;
      let hiddenWord = "";
      for (i = 0; i < word.length; i++) {
        hiddenWord += "_ ";
      }
    return (
      <>
<<<<<<< HEAD
        <div className="PlayerPanelLeft">
          I am the left panel!
          <h2>word: </h2>
          <span class="PlayerOrderSection">{hiddenWord}</span>
          <h2>guesser:</h2>
          <div class="PlayerOrderSection">
          <PlayerIcon
                  _id={guesser._id}
                  playername={guesser.playername}
                />
          </div>
          
          <h2>pixelers:</h2>
          <PlayerOrder players= {playersList}/>
          </div>
        
        
=======
        <div className="PlayerPanelLeft">I am the left panel!</div>
        {/* <PlayerOrder/> */}
>>>>>>> 4de2165d3dde38b675852c7fbdd4584c9ba1378d
      </>
    );
  }
}

export default PlayerPanelLeft;
