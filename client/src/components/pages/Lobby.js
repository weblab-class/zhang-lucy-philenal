import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import MultilineTextField from "../modules/MultilineTextField.js";
import Fade from '@material-ui/core/Fade';
import { Link } from "@reach/router";
import { navigate } from "@reach/router";
import { GoogleButton } from "./GoogleButton.js";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Lobby.css";

import { get, post, put} from "../../utilities";


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
      sessions: 1,
      wantPixelLimit: false,
      pixelLimit: null,
      wordPack: "basic",
      wordPacks: null,
      host_id: null, //is host or not
    };
  }

  componentDidMount() {

    //gets the wordpack list
    get("/api/game/wordPacks").then((res)=> {
      this.setState({wordPacks: res}, ()=> console.log(res))
    })

    get("/api/game/sessionValues").then((res) => {
      this.setState({sessionValues: res}, ()=>console.log(res))
    })

    get("/api/game/players", {
      game_id: this.props.location.state.game_id,
      user_id: this.props.location.state.user_id,
    }).then((res) => {
      console.log(res);

      if (res.status == 200) {
        this.setState({
          players: res.players,
          host_id: res.host_id,
         });
        if (res.started === true) {
          console.log("started...");
          navigate("/player", {state: {
            user_id: this.props.location.state.user_id, 
            game_id: this.props.location.state.game_id
          }});

          // TODO: figure out how to join late?
          // navigate("/pixeler", {state: {user_id: this.props.location.state.user_id, game_id: this.props.location.state.game_id}});
        } 
      } else {
        console.log(`Error: ${res.msg}`);
        navigate("/");
      }

    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      navigate("/");
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

    //listens for changed word pack
    socket.on("changedWordPack", (wordPack) => {
      if (this.props.location.state.game_id === wordPack.game_id) {
        this.setState({
          wordPack: wordPack.wordPack
        })
      }
    });

    //listens for changed sessions
    socket.on("changedSessions", (sessions) => {
      if (this.props.location.state.game_id === sessions.game_id) {
        this.setState({
          sessions: sessions.sessions
        })
      }
    });

    //listens for if want/dontwant pixel limit
    socket.on("changedWantPixelLimit", (want) => {
    if (this.props.location.state.game_id === want.game_id) {
      this.setState({
        wantPixelLimit: want.wantPixelLimit
      })
    }
  });

    //listens for pixel limit
    socket.on("changedPixelLimit", (pixelLimit) => {
      if (this.props.location.state.game_id === pixelLimit.game_id) {
        this.setState({
          pixelLimit: pixelLimit.pixelLimit
        })
      }
    });

    //listens for if game already started and navigates to pixeler page if so 
    socket.on("game_id_started", (game_id) => {
      console.log("started socket works! and props game id " + this.props.location.state.game_id + " and game id " + game_id);
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
      game_id: this.props.location.state.game_id,
      user_id: this.props.location.state.user_id,
      sessions: this.state.sessions,
      wordPack: this.state.wordPack,
      pixelLimit: this.state.wantPixelLimit ? this.state.pixelLimit: Number.POSITIVE_INFINITY,
    }).then((res) => {
      console.log("this is right before we navigate to /player " + res)
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
    if (this.state.players && this.state.wordPacks) {
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
                  <div className="Lobby-title">lobby</div>
                  {(this.props.location.state.user_id === this.state.host_id) ?
                    <MultilineTextField 
                    wordPacks={this.state.wordPacks} 
                    sessionValues={this.state.sessionValues}
                    game_id={this.props.location.state.game_id}/>: <div></div>}
                  
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

