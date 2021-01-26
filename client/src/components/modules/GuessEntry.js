import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import "../../utilities.css";
import "./GuessEntry.css";

/**
 * Generic GuessEntry component
 * @param game_id
 * @param user_id
 * @param callback callback function to parent component (onGuessEntry --> sets state of guess in parent)
 * @param className the styling
 * @param onSubmit submitGuess() --> api calls to document guess in PlayerPanelRight.js
 */
class GuessEntry extends Component {
  constructor(props) {
    super(props);
    if (this.props.clear) {
      this.props.cleared();
    }
    // Initialize Default State
    this.state = {
        text: "",
        disableButton: false,
        areYouSure: false,
        showGiveUp: false,
    };
  }

  componentWillUnmount () {
    this.is_mounted = false;
  }

  componentDidMount() {
    this.is_mounted = true;

    console.log(`Guess Entry: ${this.props.game_id}, then ${this.props.user_id}`);
    get ("/api/game/turn", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
    }).then((res) => {
      console.log(res);
      if (res.turn && this.is_mounted) {
        console.log(`Turn: ${res.turn}`);
        console.log(`Players: ${res.numPlayers}`);
        this.setState({turn: res.turn}, () => {
          if (this.state.turn == res.numPlayers-1  && this.is_mounted) {

            this.setState({showGiveUp: true});
          }
        });
      }
    }).catch((err) => console.log(err))

    socket.on("endedTurn", (updatedGame)=>{
      if (this.props.game_id === updatedGame.game_id)
      {
          this.setState({turn: updatedGame.turn}, ()=> {
              console.log("the updated turn is " + this.state.turn);
            if (this.state.turn == updatedGame.players.length - 1  && this.is_mounted) {
              this.setState({showGiveUp: true});
            }
          });
      }      
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.callback(this.state.text);

    this.props.onSubmit && this.props.onSubmit(this.state.text);
    this.setState({
      text: "",
    });
  };

  onCorrectGuess = (event) => {
    // TODO
  }

  onKeyPress = (event) => {
    if(event.key === 'Enter'){
      console.log('enter press here! ')
      this.handleSubmit(event);
    }
  }

  onTextChange = (event) => {
    this.setState({
      text: event.target.value,
    })
    this.props.callback(event.target.value);
  }

  onQuitConfirmation = (event) => {
    this.setState({
        areYouSure: true,
    });
  }

  onQuit = (event) => {
    post("api/game/onQuit", 
    {
      game_id: this.props.game_id,
      textOverlay: "oof :("
    }).then((game) => {
    });
  }

  render() {

    return (
      <>
        <div className="GuessEntry-container">
            {/* <form> */}
                <div className="GuessEntry-child">
                    <input
                        type='text'
                        className="GuessEntry-underline"
                        value={this.state.text}
                        onChange={this.onTextChange}
                        onKeyPress={this.onKeyPress}
                    />
                </div>
                <div className="GuessEntry-buttonContainer">
                <div className="GuessEntry-child">
                    <button
                        type="submit"
                        className="GuessEntry-button u-pointer"
                        value="Submit"
                        onClick={this.handleSubmit}
                        disabled={this.state.disableButton}
                    >submit
                    </button>
                </div>
                {this.state.showGiveUp &&
                <div className="GuessEntry-child">
                    <button
                        type="submit"
                        className="GuessEntry-button u-pointer"
                        value="Submit"
                        onClick={this.onQuitConfirmation}
                        disabled={this.state.areYouSure}
                    >give up
                    </button>
                </div>}
                </div>
                
            {/* </form> */}
        </div>
        {this.state.areYouSure && 
        
        <div className="GuessEntry-quitConfirmationContainer">
            <div className="GuessEntry-quitConfirmationChild">
                are you sure?
            </div>
            <div className="GuessEntry-quitConfirmationChild">
                <button onClick={this.onQuit}>
                    yes, I give up
                </button>
            {/* </div>
            <div className="GuessEntry-quitConfirmationChild"> */}
                <button onClick={()=>{this.setState({areYouSure: false})}}>
                    cancel
                </button>
            </div>
        </div>}

      </>
    );
  }
}

export default GuessEntry;
