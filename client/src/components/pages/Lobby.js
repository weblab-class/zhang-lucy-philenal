import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
// import "./Lobby.css";

import { get, post } from "../../utilities";


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
  
const host = {
    playername: "Me",
    _id: "0"
  };
  

/**
 * Lobby page is what the user travels to after making/joining
 * a game. The host can start the game.
 * 
 * @param game_id
 * @param user_id 
 */
class Lobby extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    // get("/api/game/get", {game_id: this.props.game_id})
    console.log(this.props);
  }

  render() {
    // let playerNames = playersList.map((player) => {player.playername});
    
    let players = []
    for (let i = 0; i < playersList.length; i++) {
      players.push(
        <div className="PlayerPanelLeft-player">
          {playersList[i].playername}
        </div>
      )
    } 
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="Lobby">
                Lobby
                {players}
                {(this.props.user_id == host._id) ? 
                    <button className="Lobby-startGame">start game</button> :
                    <div></div>
                }
            </div>

      </>
    );
  }
}

export default Lobby;
