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
          playerJoin_id: [],
          playerLeft_id: [],
        };
      }

      componentDidMount() {
        socket.on("players_and_game_id", (updatedGame)=> {
          this.setState({
              playerJoin_id: updatedGame.playerJoin_id ? playerJoin_id.concat(updatedGame.playerJoin_id): playerJoin_id,
              playerLeft_id: updatedGame.playerLeft_id ? playerLeft_id.concat(updatedGame.playerLeft_id): playerLeft_id,
            })
        })
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
                playerJoin={this.state.playerJoin_id.includes(pixeler._id)}
                playerLeft={this.state.playerLeft_id.includes(pixeler._id)}
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