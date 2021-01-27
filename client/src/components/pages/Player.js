import { navigate } from "@reach/router";
import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get } from "../../utilities";
import "../../utilities.css";
import Guesser from "./Guesser";
import Pixeler from "./Pixeler";
import "./Player.css";
import Start from "./Start";
import ReactLoading from 'react-loading';

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
            round: 1,
            hiddenWord: null,
            correctGuess: false, //unhardcode??
            turn: 0,
            isLoading: true,
        };
    }

    componentWillUnmount () {
        this.is_mounted = false;
    }
    
    // TODO: add game started/finished check
    componentDidMount() {
        this.is_mounted = true;
        
        console.log(this.props);
        if (!this.props.location.state.user_id) {
            navigate("/")
        }

        get("/api/game/get", {
            game_id: this.props.location.state.game_id,
            user_id: this.props.location.state.user_id,
        }).then((res) => {
            this.setState({
                word: res.word,
                turn: res.turn,
                round: res.round,
                maxSessions: res.maxSessions,
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
                    console.log(`Error: ${this.state.error}`)
                    if (this.is_mounted) {
                        this.setState({ 
                            player: res.status, 
                            game_id: res.game_id 
                        });
                    }
                } else {
                    console.log("error");
                    if (this.is_mounted) {
                        this.setState({ error: true });
                    }
                    navigate("/");
                }
            }
        }).catch((err) => {
            console.log(err);
        });
       

        //listens for turn change, updates turn
        socket.on("endedTurn", (updatedGame)=>{
            if (this.props.location.state.game_id === updatedGame.game_id && this.is_mounted)
            {
                this.setState({turn: updatedGame.turn}, ()=> {
                    console.log("the updated turn is " + this.state.turn);
                })
            };
        //if guessed correctly, show the word!
        socket.on("correct_guess", (updatedGame) => {
            if (this.props.game_id === updatedGame.game_id && this.is_mounted) {
            this.setState({
                word: updatedGame.word,
                correctGuess: true
            });
            }
        });
  
        //if gave up, show the word!
        socket.on("textOverlay", (updatedGame) => {
            if (this.props.game_id === updatedGame.game_id && this.is_mounted) {
                this.setState({
                words: updatedGame.word,
                correctGuess: false,
            });
            }
        });
        })

        //resolved (maybe) ? haven't tested: sometimes word shows when guesser o.o but after refresh issall good ...
        //socket issue?

        // listens for next word, updates word
        // also listens for player status?
        socket.on("nextWord", (updatedGame) =>{
            if (this.props.location.state.game_id === updatedGame.game_id)
            {
                if (updatedGame.guesser._id == this.props.location.state.user_id && this.is_mounted) {
                    console.log("you are the guesser!");
                    this.setState({
                        word: updatedGame.game.word,
                        // hiddenWord: this.hideWord(updatedGame.game.word.length),
                        turn: updatedGame.turn,
                        players: updatedGame.players,
                        pixelers: updatedGame.pixelers,
                        guesser: updatedGame.guesser,
                        round: updatedGame.round,
                        player: "guesser"
                    })
                } else {
                    for (let i = 0; i < this.state.pixelers.length; i++) {
                        if(updatedGame.pixelers[i].id == this.props.location.state.user_id && this.is_mounted) {
                            this.setState({
                                word: updatedGame.game.word,
                                // hiddenWord: this.hideWord(updatedGame.game.word.length),
                                turn: updatedGame.turn,
                                players: updatedGame.players,
                                pixelers: updatedGame.pixelers,
                                guesser: updatedGame.guesser,
                                round: updatedGame.round,
                                player: "pixeler"
                            });
                        } else {
                            if (this.is_mounted) {
                                this.setState({
                                    word: updatedGame.game.word,
                                    // hiddenWord: this.hideWord(updatedGame.game.word.length),
                                    turn: updatedGame.turn,
                                    players: updatedGame.players,
                                    pixelers: updatedGame.pixelers,
                                    guesser: updatedGame.guesser,
                                    round: updatedGame.round,
                                    player: "neither"
                                });
                            }
                        }
                    }
                }
                /* this.setState({
                    word: updatedGame.game.word,
                    // hiddenWord: this.hideWord(updatedGame.game.word.length),
                    turn: updatedGame.turn,
                    players: updatedGame.players,
                    pixelers: updatedGame.pixelers,
                    guesser: updatedGame.guesser,
                }, ()=> {
                    // console.log("the turn is " + 
                    // this.state.turn + " the updated word is " + 
                    // this.state.word + " with hidden word " + 
                    // this.state.wo);
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
                }) */
            };
        })
    }
    
    render() {
        console.log(this.state);
        console.log(this.props);
        if (this.state.error) { //if there's error 
            return(<><Start/></>);
        //if state hasn't been altered for player yet
        } else if (!this.state.player || !this.state.game_id) { 
            return (<div className="LoadingScreen"> 
                <ReactLoading type={"bars"} color={"grey"} />
                    </div>);
        } else {
            return (
                <> 
                    {this.state.player == "guesser" ? 
                    <Guesser 
                        /* callback={this.onCorrectGuess}  */
                        word={this.state.word} 
                        game_id={this.state.game_id} 
                        user_id={this.props.location.state.user_id} 
                        // user_name={this.props.location.state.user_name}
                        turn={this.state.turn}
                        round={this.state.round}
                        maxSessions={this.state.maxSessions} /> :
                        
                    <Pixeler 
                        word={this.state.word} 
                        game_id={this.state.game_id} 
                        user_id={this.props.location.state.user_id} 
                        // user_name={this.props.location.state.user_name}
                        turn={this.state.turn}
                        round={this.state.round}
                        maxSessions={this.state.maxSessions} />}
                </>
            );
        }
        
    }
}

export default Player;
