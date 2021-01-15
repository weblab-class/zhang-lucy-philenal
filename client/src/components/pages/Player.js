import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";

import "./Player.css";

import { get } from "../../utilities";
import Start from "./Start";
import Guesser from "./Guesser";
import Pixeler from "./Pixeler";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * This is the page view of a player, either Pixeler or Guesser
 * 
 * @param game_id The ID of the game
 * @param user_id The ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
 * @param {String} word
 */
class Player extends Component {
    constructor(props) {
        super(props);
        // Initialize Default State
        this.state = {
            error: false,
        };
    }

    // TODO: add game started/finished check
    componentDidMount() {
        get("/api/game/players", {
            game_id: this.props.location.state.game_id,
            user_id: this.props.location.state.user_id
        }).then((res) => {
            console.log(res);
            if (res.length == 0) {
                // TODO? figure out props probably
                navigate("/");
                return;
            } else {
                console.log(`You are the ${res[0]}!`);
                if (res[0] == "guesser" || res[0] == "pixeler") {
                    this.setState({ player: res[0] });
                } else {
                    console.log("error");
                    this.setState({ error: true });
                    navigate("/");
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        if (this.state.error) {
            return(<><Start/></>);
        }
        return (
            <>
                {this.state.player == "guesser" ? 
                <Guesser game_id={this.props.location.state.game_id} user_id={this.props.location.state.user_id}/> :
                <Pixeler game_id={this.props.location.state.game_id} user_id={this.props.location.state.user_id}/>}
            </>
        );
    }
}

export default Player;
