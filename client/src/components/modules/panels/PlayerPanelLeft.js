import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../../utilities.css";
import GuesserIcon from "./GuesserIcon.js";
import PlayerOrder from "./PlayerOrder.js";
import "./PlayerPanel.css";
import "./PlayerPanelLeft.css";


/**
 * Component to render the left panel
 *
 * Proptypes
 * @param {UserObject[]} pixelers
 * @param {Number} turn - what turn number (0, pixelers.length) game is on
 * @param {User} guesser
 * @param {Boolean} isGuesser
 * @param {String} word* - only if isGuesser=false
 * @param leaveGame callback function
 * 
 * DIDNT ADD THE PROPS BELOW!!! THESE ARE NOT ACTUAL PROPS
 * @param {String} user_id - we can get all of the above from this
 * @param {String} game_id
 */

class PlayerPanelLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.props.word,
      error: false,
    };
  }

  componentDidMount() {
    // If anyone leaves the game, go back to the home screen
    if (!this.props.guesser || this.props.pixelers.length == 0) {
      console.log("game ending");
     navigate("/");
    }
  }

  render() {
    return (
      <>
        {(!this.state.error && this.props.guesser) && 
        <div className="PlayerPanelLeft">
          <div className="PlayerPanelLeft-header">word: 
            <span className="PlayerPanelLeft-word">
              {(this.props.word)}
            </span>
          </div>
          <div className="PlayerPanelLeft-header">guesser:</div>
          <GuesserIcon guesser_name={this.props.guesser.name} _id={this.props.guesser._id} isMyTurn = {this.props.turn===this.props.pixelers.length ? true: false}/>
          <div className="PlayerPanelLeft-header">pixelers:</div>
          <PlayerOrder pixelers={this.props.pixelers} turn={this.props.turn}/>
        </div>
        }
      </>
    );
  }
}

export default PlayerPanelLeft;
