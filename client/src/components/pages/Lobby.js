import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import { Link } from "@reach/router";
import { navigate } from "@reach/router";
import { GoogleButton } from "./GoogleButton.js";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Lobby.css";

import { get, post, put} from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";


/**
 * Lobby page is what the user travels to after making/joining
 * a game. The host can start the game.
 * 
 * @param game_id created in NewGame by the host (what the host inputted)
 * @param user_id google id
 * @param user_name google name
 */
class Lobby extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      players: [],
      host_id: null, //is host or not
    };
  }

  componentDidMount() {
    get("/api/game/get", {
      game_id: this.props.location.state.game_id
    }).then((res) => {
      console.log(res);
      this.setState({
        players: res[0].players,
        host_id: res[0].host_id,
       });
      if (res[0].started === true) {
        console.log("started...");
        if (res[0].players.includes({_id: this.props.location.state.user_id})) {
          navigate("/player", {state: {
            user_id: this.props.location.state.user_id, 
            game_id: this.props.location.state.game_id
          }});
        } else {
          
        }
        navigate("/");
        // TODO: figure out how to join late
        // navigate("/pixeler", {state: {user_id: this.props.location.state.user_id, game_id: this.props.location.state.game_id}});
      }
    })
    .catch((err) => {
      console.log(err);
    })

    //listens for if players list is changed (if someone joined) and updates players state
    socket.on("players_and_game_id", (players_and_game_id_object) => {
      if (this.props.location.state.game_id === players_and_game_id_object.game_id) { //if the game id sent out is ours
        this.setState({
          players: players_and_game_id_object.players,
        }, ()=>{
          console.log("updated players ");
          console.log(this.state.players);
        })
      }
    });

    //listens for if game already started and navigates to pixeler page if so 
    socket.on("game_id_started", (game_id) => {
      if (this.props.location.state.game_id === game_id) { //if game that started is your game_id
        // TODO: maybe
        navigate("/player", {state: {
          user_id: this.props.location.state.user_id, 
          game_id: this.props.location.state.game_id
        }});
      }
    });
  }
 
  // TODO: fix this put request
  startGame = () => {
    put("/api/game/start", {
      game_id: this.props.location.state.game_id
    }).then((res) => {
      console.log(res)
      navigate("/player", {state: {
        user_id: this.props.location.state.user_id, 
        game_id: this.props.location.state.game_id,
        }});
    }).catch((err) => {
      console.log(err)
    });
  }

  leaveGame = () => {
    post("/api/user/leave", {
      user_id: this.props.location.state.user_id,
      game_id: this.props.location.state.game_id,
    }).then((res) => {
      if (res.success) { 
        navigate("/");
      }
    })
  }

  render() {
    if (this.state.players) {
      let players = []
      for (let i = 0; i < this.state.players.length; i++) {
        players.push(
          <div className="PlayerPanelLeft-player">
            {this.state.players[i].name}
          </div>
        )
      } 
      console.log(this.props.location.state.user_id);
      console.log("host: " + this.state.host_id)
      return (
        <> 
              {/* <div><GoogleButton/></div> */}
              <div>hello, {this.props.location.state.user_name}!</div>
              <button onClick={this.leaveGame}>leave game</button>
              <div className="Lobby">
                  <div className="Lobby-title">Lobby</div>
                  <br></br>game ID: <b>{this.props.location.state.game_id}</b><br></br>
                  {players}
                  {(this.props.location.state.user_id === this.state.host_id) ? 
                      <button 
                      className="Lobby-startGame u-color-1"
                      onClick={this.startGame}>
                        start game
                        </button> :
                      <div></div>
                  }
              </div>

        </>
      );
    } else {
      console.log(this.state.players);
      return (<></>);
    }
  }
}

export default Lobby;

