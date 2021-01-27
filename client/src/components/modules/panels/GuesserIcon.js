//should contain a square for player + player's name
// guesser's name should be passed as a prop from start/join game screen from somewhere
import React, { Component } from "react";
import { socket } from "../../../client-socket.js";
import "../../../utilities.css";
import "./PlayerPanelLeft.css";
/**
 * Component to show the guesser icon + name
 *
 * Proptypes
 * @param {String} guesser_name
 * @param {String} _id don't necessarily need this?
 * @param {Boolean} isMyTurn
 */

class GuesserIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
          inGame: null,
        };
      } 

      componentDidMount() {
        //listens for updated players
        socket.on("players_and_game_id", (updatedGame)=>{
          if (this.props.game_id === updatedGame.game_id)
          {   let inGame = false;
              for (let i=0; i < updatedGame.players.length; i ++){
                if (updatedGame.players[i]._id == this.props._id){
                  inGame = true;
                }
              }
              this.setState({
                inGame: inGame,
              })
          };
      });
      }

      render() {
        let colorClass = "PlayerIcon-icon "
        if (this.state.inGame==null || this.state.inGame){
          colorClass = colorClass + "u-color-6"
        } else {
          colorClass= colorClass + "u-color-grey"
        }
        return (
            <div className={this.props.isMyTurn ? 'PlayerIcon-backgroundWhite PlayerIcon-container': 'PlayerIcon-container'}> {/* turns white if it's your turn */}
                <div className="PlayerIcon-left u-flex-alignCenter">
                  <div className="GuesserIcon-order">0</div>
                  <div className={colorClass}></div>
                  <div className="PlayerIcon-right">
                    {this.props.guesser_name}
                </div>
                </div>
            </div>
          
        );
      }

}
export default GuesserIcon;