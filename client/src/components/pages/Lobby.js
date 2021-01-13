import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Lobby.css";

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
      players: [],
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/game/get", {game_id: this.props.game_id})
    .then((res) => {
      console.log(res);
      this.setState({players: res[0].players})
      .then(
        console.log("done!")
      );
    })
    .catch((err) => {
      console.log(err);
    })
    // console.log(this.props);
  }

  render() {
    
    let players = []
    for (let i = 0; i < this.state.players.length; i++) {
      players.push(
        <div className="PlayerPanelLeft-player">
          {this.state.players[i].name}
        </div>
      )
    } 
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="Lobby">
                <div className="Lobby-title">Lobby</div>
                <br></br>game ID: <b>{this.props.game_id}</b><br></br>
                {players}
                {(this.props.user_id == host._id) ? 
                    <button className="Lobby-startGame u-color-1">start game</button> :
                    <div></div>
                }
            </div>

      </>
    );
  }
}

export default Lobby;
