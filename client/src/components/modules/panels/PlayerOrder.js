//contain all the players/pixelers in some order, put this in PlayerPanelLeft.js
//PlayerOrder should give PlayerIcon the turn prop -- whether it's their turn or not
import React, { Component } from "react";
import PlayerIcon from "./PlayerIcon.js";
import "../../../utilities.css";
import "./PlayerPanelLeft.css";
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
        };
      }

      componentDidMount() {
        // remember -- api calls go here!
      }

      render() {
        /*let players = this.props.players;
        let playerIcons = [];
        for (let i = 0; i < players.length; i++) {
          playerIcons.push(
            <PlayerIcon
            _id={players[i]._id}
            playername={players[i].playername}
            order={i+1}
          />
          )
        }*/
          const playerIcons = this.props.pixelers.map((pixeler, index) => {
          let isMyTurn = false;
          if (this.props.turn == index){
            isMyTurn = true;
          } 
          return (
          <PlayerIcon
            _id={pixeler._id}
            key={pixeler._id} //react needs unique key identifier or else won't compile
            playername={pixeler.name}
            order={index+1}
            isMyTurn = {isMyTurn}
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