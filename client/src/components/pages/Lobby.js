import { navigate } from "@reach/router";
import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get, post, put } from "../../utilities";
import MultilineTextField from "../modules/MultilineTextField.js";
import ToggleButton from "../modules/ToggleButton";
import MadeWithLuv from "../modules/MadeWithLuv.js";
import "../../utilities.css";
import "./Lobby.css";

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
      pixel_proportion: 0.4,
      wordPack: "basic (easy)",
      wordPacks: null,
      host_id: null, //is host or not
    };
  }

  componentWillUnmount () {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;
    //gets the wordpack list
    get("/api/game/wordPacks").then((res)=> {
      if (this.is_mounted) {
        this.setState({wordPacks: res}, ()=> console.log(res))
      }
    });

    get("/api/game/sessionValues").then((res) => {
      if (this.is_mounted) {
        this.setState({sessionValues: res}, ()=>console.log(res))
      }
    });

    get("/api/game/difficulties").then((res) => {
      if (this.is_mounted) {
        this.setState({difficulties: res}, ()=>console.log(res))
      }
    });

    get("/api/game/players", {
      game_id: this.props.location.state.game_id,
      user_id: this.props.location.state.user_id,
    }).then((res) => {

      if (res.status == 200 && this.is_mounted) {
        this.setState({
          players: res.players,
          host_id: res.host_id,
         });
        if (res.started === true) {
          navigate("/player", {state: {
            user_id: this.props.location.state.user_id, 
            game_id: this.props.location.state.game_id
          }});
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
      if (this.props.location.state.game_id === players_and_game_id_object.game_id && this.is_mounted) { //if the game id sent out is ours
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
      if (this.props.location.state.game_id === wordPack.game_id && this.is_mounted) {
        this.setState({
          wordPack: wordPack.wordPack
        })
      }
    });

    //listens for changed sessions
    socket.on("changedSessions", (sessions) => {
      if (this.props.location.state.game_id === sessions.game_id && this.is_mounted) {
        this.setState({
          sessions: sessions.sessions
        })
      }
    });

    //listens for changed difficulty
    socket.on("changedDifficulty", (res) => {
      if (this.props.location.state.game_id === res.game_id && this.is_mounted) {
        this.setState({
          pixel_proportion: res.pixel_proportion
        }, ()=>{})
      }
    })

    //listens for if game already started and navigates to pixeler page if so 
    socket.on("game_id_started", (game_id) => {
      if (this.props.location.state.game_id === game_id && this.is_mounted) { //if game that started is your game_id
        navigate("/player", {state: {
          user_id: this.props.location.state.user_id, 
          game_id: this.props.location.state.game_id,
          user_name: this.props.location.state.user_name,
        }});
      }
    });
  }

  startGame = () => {
    let pixel_limit = Math.round(400 * this.state.pixel_proportion / this.state.players.length);
    put("/api/game/start", {
      game_id: this.props.location.state.game_id,
      user_id: this.props.location.state.user_id,
      sessions: this.state.sessions,
      wordPack: this.state.wordPack,
      pixel_limit: pixel_limit,
    }).then((res) => {
      if (res.status == "success") {
        navigate("/player", {state: {
          user_id: this.props.location.state.user_id, 
          game_id: this.props.location.state.game_id,
          user_name: this.props.location.state.user_name,
          }});
      } 
    }).catch((err) => {
      console.log(`Error: ${err}`);
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
    if (this.state.players && this.state.wordPacks && this.state.sessionValues && this.state.difficulties) {
      let players = []
      for (let i = 0; i < this.state.players.length; i++) {
        players.push(
          <div className="Lobby-player">
            {this.state.players[i].name}
          </div>
        )
      } 
      return (
        <> 
              {/* <div><GoogleButton/></div> */}
              <div className="u-welcome">
                <div>
                hello, {this.props.location.state.user_name}!
                </div>
                <div>
                <ToggleButton/>
                </div>
              </div>            

              <div className="u-back-button-container">
              <button onClick={this.leaveGame}>leave game</button>
              </div>   
              <div className="Lobby-container">
                <div className="Lobby-title">
                  lobby
                  </div>
                <div className="Lobby-rowPixel">
                  <div className="Lobby-pixels u-color-1"></div>
                  <div className="Lobby-pixels u-color-2"></div>
                  <div className="Lobby-pixels u-color-3"></div>
                  <div className="Lobby-pixels u-color-4"></div>
                </div>
                <div className="Lobby-entireColumn">
                  <div className="Lobby">
                    {(this.props.location.state.user_id === this.state.host_id) ?
                      <div>
                      <div className="Lobby-header Lobby-margin">
                        settings:
                      </div>
                        <MultilineTextField 
                        num_players={players.length}
                        wordPacks={this.state.wordPacks} 
                        sessionValues={this.state.sessionValues}
                        difficulties={this.state.difficulties}
                        game_id={this.props.location.state.game_id}/>
                      </div>

                      : <div></div>}
                      <div className="Lobby-column">
                        <div className="Lobby-header">
                          game ID:
                          </div> 
                        <div className="Lobby-id">{this.props.location.state.game_id}</div>
                        <div className="Lobby-header">
                          players:
                        </div>
                        {players}
                      </div>
                  </div>
                {(this.props.location.state.user_id === this.state.host_id) ? 
                          <button 
                          className="Lobby-startGame"
                          onClick={this.startGame}
                          disabled={players.length <= 1}>
                            start game
                            </button> :
                          <div></div>
                      }
                </div>
              </div>
              <MadeWithLuv />

        </>
      );
    } else {
      console.log(this.state.players);
      return (<></>);
    }
  }
}

export default Lobby;

