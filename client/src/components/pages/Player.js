import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { socket } from "../../client-socket.js";
import { navigate } from "@reach/router";

import "../../utilities.css";

import "./Player.css";

import { get } from "../../utilities";
import Start from "./Start";
import Guesser from "./Guesser";
import Pixeler from "./Pixeler";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * This is the page view of a player, either Pixeler or Guesser. Keeps track of turn number.
 * 
 * @param game_id The ID of the game
 * @param user_id The google ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
 * @param {String} word
 */
class Player extends Component {
    constructor(props) {
        super(props);

        if (!this.props.location.state || !this.props.location.state.user_id) {
            navigate("/");
        }
        // Initialize Default State
        this.state = {
            player: null,
            error: false,
            turn: 0, //TODO: if turn exceeds number of players .. ?
        };
    }

    // TODO: add game started/finished check
    componentDidMount() {
        console.log(this.props);
        if (!this.props.location.state.user_id) {
            navigate("/")
        }
        
        get("/api/game/player_status", {
            user_id: this.props.location.state.user_id,
        }).then((res) => {
            console.log(res);
            if (res.length == 0) {
                // TODO? figure out props probably
                console.log(res);
                navigate("/");
            } else {
                console.log(`You are the ${res.status}!`);
                if (res.status == "guesser" || res.status == "pixeler") {
                    console.log(this.state.error)
                    this.setState({ player: res.status });
                    this.setState({ game_id: res.game_id });
                } else {
                    console.log("error");
                    this.setState({ error: true });
                    navigate("/");
                }
            }
        }).catch((err) => {
            console.log(err);
        });

        //listens for turn change, updates turn
        socket.on("endedTurn", (updatedGame)=>{
            console.log("the socket for ending turn worked");
            console.log("props game id: " + this.props.location.state.game_id);
            console.log("updated game id: " + updatedGame.game_id);
            if (this.props.location.state.game_id === updatedGame.game_id)
            {
                this.setState({
                    turn: updatedGame.turn
                }, ()=> {
                    console.log("the updated turn is " + this.state.turn);
                })
            };
            
        })
    }

    render() {
        console.log(this.state);
        if (this.state.error) { //if there's error 
            return(<><Start/></>);
        } else if (!this.state.player || !this.state.game_id) { //if state hasn't been altered for player yet
            return (<div></div>)
        } else {
            return (
                <> 
                    {this.state.player == "guesser" ? 
                    <Guesser game_id={this.state.game_id} user_id={this.props.location.state.user_id} turn={this.state.turn} /> :
                    <Pixeler game_id={this.state.game_id} user_id={this.props.location.state.user_id} turn={this.state.turn}/>}
                </>
            );
        }
        
    }
}

export default Player;
