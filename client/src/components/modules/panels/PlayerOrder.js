//contain all the players/pixelers in some order, put this in PlayerPanelLeft.js
//PlayerOrder should give PlayerIcon the turn prop -- whether it's their turn or not
import React, { Component } from "react";
import PlayerIcon from "./PlayerIcon.js";
import "../../../utilities.css";
import "./PlayerPanelLeft.css";
import { socket } from "../../../client-socket.js";
/**
 * @typedef UserObject
 * @property {String} _id of player
 * @property {String} name of the player
 */

/**
 * Component to render a column of players
 *
 * Proptypes
 * @param {UserObject[]} pixelers
 * @param {Number} turn
 */

class PlayerOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentPlayers: null,
        };
      }

      componentDidMount() {
         //listens for updated players
         socket.on("players_and_game_id", (updatedGame)=>{
          if (this.props.game_id === updatedGame.game_id)
          {
              this.setState({currentPlayers: updatedGame.players}, ()=> {
                  console.log("the updated players " + this.state.currentPlayers);
              })
          };
      });
      }

      render() {
          const playerIcons = this.props.pixelers.map((pixeler, index) => {
              return (
              <PlayerIcon
                _id={pixeler._id}
                key={pixeler._id} //react needs unique key identifier or else won't compile
                playername={pixeler.name}
                order={index+1}
                isMyTurn={index===this.props.turn}
                //if someone joined/left game, then check if it's in the current players list. 
                //if nothing is changed, then it's still in current player
                inGame={this.state.currentPlayers!=null ? this.state.currentPlayers.includes(pixeler): true}
              />
            ); 
          });
        return (
            
            <div className="PlayerOrder-container u-flexColumn">
              {playerIcons}
            </div>
          
        );
      }

}
export default PlayerOrder;