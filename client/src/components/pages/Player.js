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
import TransitionsModal from "../modules/TransitionsModal.js";


/**
 * This is the page view of a player, either Pixeler or Guesser. Keeps track of 
 * turn number, and word.
 * 
 * @param game_id The ID of the game
 * @param user_id The google ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
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
            word: null,
            hiddenWord: null,
            correctGuess: false, //unhardcode??
            turn: 0, //TODO: if turn exceeds number of players .. ?
        };
    }
    
    // TODO: add game started/finished check
    componentDidMount() {
        console.log(this.props);
        if (!this.props.location.state.user_id) {
            navigate("/")
        }

        // TODO (lucy): BAD FUNCTION
        get("/api/game/get", {
            game_id: this.props.location.state.game_id,
            user_id: this.props.location.state.user_id,
        }).then((res) => {
            //creates the hidden word and sets state
            this.setState({
                word: res.word, //// TODO: HIDE THIS FROM GUESSER
                hiddenWord: this.hideWord(res.wordLength),
            });
        }).catch((err) => {
            console.log(err);
            navigate("/");
        })

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
            if (this.props.location.state.game_id === updatedGame.game_id)
            {
                this.setState({turn: updatedGame.turn}, ()=> {
                    console.log("the updated turn is " + this.state.turn);
                })
            };
        //if guessed correctly, show the word!
        socket.on("correct_guess", (updatedGame) => {
            if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
            this.setState({
                hiddenWord: updatedGame.word,
                correctGuess: true
            });
            }
        });
  
  
        //if gave up, show the word!
        socket.on("textOverlay", (updatedGame) => {
            if (this.props.game_id === updatedGame.game_id) { //if the game id sent out is ours
                console.log("I SHOW WORD")
                this.setState({
                hiddenWord: updatedGame.word,
                correctGuess: false,
            });
            }
        });

        })

        // listens for next word, updates word
        // also listens for player status?
        socket.on("nextWord", (updatedGame) =>{
            if (this.props.location.state.game_id === updatedGame.game_id)
            {
                this.setState({
                    // word: updatedGame.game.word,
                    hiddenWord: this.hideWord(updatedGame.game.word.length),
                    turn: updatedGame.turn,
                    players: updatedGame.players,
                    pixelers: updatedGame.pixelers,
                    guesser: updatedGame.guesser,
                }, ()=> {
                    console.log("the turn is " + 
                    this.state.turn + " the updated word is " + 
                    this.state.word + " with hidden word " + 
                    this.state.hiddenWord);
                    if (this.state.guesser._id == this.props.location.state.user_id) {
                        console.log("you are the guesser!");
                        this.setState({player: "guesser"});
                    } else {
                        for (let i = 0; i < this.state.pixelers.length; i++) {
                            if(this.state.pixelers[i].id == this.props.location.state.user_id) {
                                this.setState({player: "pixeler"});
                                return;
                            }
                        }
                        this.setState({player: "neither"});
                    }
                })
            };
        })
    }

    //hides the word
    hideWord = (wordLength) => {
        let hiddenWord = "";
            for (let i = 0; i < wordLength; i++) {
                hiddenWord += "_ ";
            }
        return hiddenWord;
    }

    /* onCorrectGuess = (word) => {
        this.setState({hiddenWord: word});
        this.setState({correctGuess: true});
      }
 */
    render() {
        console.log(this.state);
        console.log(this.props);
        if (this.state.error) { //if there's error 
            return(<><Start/></>);
        //if state hasn't been altered for player yet
        } else if (!this.state.player || !this.state.game_id) { 
            console.log("sad");
            return (<div></div>);
        } else {
            return (
                <> 
                    {this.state.player == "guesser" ? 
                    <Guesser 
                        /* callback={this.onCorrectGuess}  */
                        hiddenWord={this.state.hiddenWord} 
                        game_id={this.state.game_id} 
                        user_id={this.props.location.state.user_id} 
                        user_name={this.props.location.state.user_name}
                        turn={this.state.turn} /> :
                    <Pixeler 
                        game_id={this.state.game_id} 
                        user_id={this.props.location.state.user_id} 
                        user_name={this.props.location.state.user_name}
                        turn={this.state.turn}/>}
                </>
            );
        }
        
    }
}

export default Player;
