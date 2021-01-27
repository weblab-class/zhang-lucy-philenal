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
          inGame: true,
        };
      } 

      componentDidMount() {
        //listens for updated players
        socket.on("players_and_game_id", (updatedGame)=>{
          if (this.props.game_id === updatedGame.game_id)
          { 
            for (let i=0; i < updatedGame.recently_left.length; i ++){
              if (updatedGame.recently_left[i]._id == this.props._id){
                this.setState({
                  inGame: false,
                })
              }
            }
          };
      });
      }

      render() {
       /*  let colorClass = "PlayerIcon-icon "
        if (this.state.inGame==null || this.state.inGame){
          colorClass = colorClass + "u-color-6"
        } else {
          colorClass= colorClass + "u-color-grey"
        } */
        let colorClass = "PlayerIcon-container "
        if ((this.state.inGame==null || this.state.inGame) && this.props.isMyTurn) {
            colorClass = colorClass + "PlayerIcon-backgroundWhite"
        } else if (!(this.state.inGame==null || this.state.inGame)){
          colorClass= colorClass + "PlayerIcon-backgroundGrey"
        }
        return (
            <div className={colorClass}> {/* turns white if it's your turn, grey if you disappear */}
                <div className="PlayerIcon-left u-flex-alignCenter">
                  <div className="GuesserIcon-order">0</div>
                  <div className="PlayerIcon-icon u-color-6"></div>
                  <div className="PlayerIcon-right">
                    {this.props.guesser_name}
                </div>
                </div>
            </div>
          
        );
      }

}
export default GuesserIcon;