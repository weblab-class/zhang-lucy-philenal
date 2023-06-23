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
import MadeWithLuv from "../modules/MadeWithLuv.js";
/**
 * This is the page view of a player, either Pixeler or Guesser. Keeps track of 
 * turn number, and word.
 * 
 * @param game_id The ID of the game
 * @param _id The google ID of the particular player
 * 
  * Proptypes
 * @param {PlayerObject[]} players
 */
class Player extends Component {
    constructor(props) {
        super(props);

        if (!this.props.location.state || !this.props.location.state._id) {
            navigate("/");
        }
        // Initialize Default State
        this.state = {
            player: null,
            error: false,
            word: null,
            round: 1,
            correctGuess: false, //unhardcode??
            turn: 0,
            isLoading: true,
        };
        this.setInputState = this.setInputState.bind(this);
    }

    setInputState(event) {
        this.setState({ term: event.target.value });
      }

    componentWillUnmount () {
        this.is_mounted = false;
    }
    
    componentDidMount() {
        this.is_mounted = true;
        
        if (!this.props.location.state._id) {
            navigate("/")
        }

        get("/api/game/get", {
            game_id: this.props.location.state.game_id,
            _id: this.props.location.state._id,
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
            _id: this.props.location.state._id,
        }).then((res) => {
            if (res.length == 0) {
                navigate("/");
            } else {
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
            if (this.props.location.state.game_id === updatedGame.game_id && 
                this.is_mounted)
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
                this.setState({
                    turn: updatedGame.turn,
                    players: updatedGame.players,
                    pixelers: updatedGame.pixelers,
                    guesser: updatedGame.guesser,
                    round: updatedGame.round,
                });
                if (updatedGame.guesser._id == this.props.location.state._id && 
                    this.is_mounted) {
                    this.setState({player: "guesser"});
                } else if (this.is_mounted) {
                    this.setState({player: "pixeler"});
                }
     
            }
        });
    }
    
    render() {
        if (this.state.error) {  
            return(<><Start/></>);
        } else if (!this.state.player || !this.state.game_id) { 
            return (<div className="LoadingScreen"> 
                <ReactLoading type={"bars"} color={"grey"} />
                    </div>);
        } else {
            return (
                <> 
                    {this.state.player == "guesser" ? 
                    <Guesser 
                        word={this.state.word} 
                        game_id={this.state.game_id} 
                        _id={this.props.location.state._id} 
                        turn={this.state.turn}
                        round={this.state.round}
                        maxSessions={this.state.maxSessions} /> :
                        
                    <Pixeler 
                        word={this.state.word} 
                        game_id={this.state.game_id} 
                        _id={this.props.location.state._id} 
                        turn={this.state.turn}
                        round={this.state.round}
                        maxSessions={this.state.maxSessions} />}
                </>
            );
        }
    }
}

export default Player;
