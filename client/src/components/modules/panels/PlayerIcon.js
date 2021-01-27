//should contain a square for player + player's name
// player's name should be passed as a prop from start/join game screen from somewhere
//put this in PlayerOrder.js
import React, { Component } from "react";

import "../../../utilities.css";
import "./PlayerPanelLeft.css";
/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {String} playername
 * @param {String} _id don't necessarily need this?
 * @param {Boolean} isMyTurn
 * @param {Number} order
 * @param {Boolean} inGame -- if pixeler in game or not
 */

class PlayerIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

      componentDidMount() {
      }

      render() {
        let backgroundGrey = 'PlayerIcon-container ';
        let colorClass = "PlayerIcon-icon ";
        
        if (!this.props.inGame){
          backgroundGrey = backgroundGrey + "PlayerIcon-backgroundGrey"
        } else if (this.props.isMyTurn){
          backgroundGrey = backgroundGrey + "PlayerIcon-backgroundWhite"
        } else {
        }

        if (this.props.order % 4 == 0){
          colorClass = colorClass + "u-color-1"
        } else if (this.props.order % 4 == 1){
          colorClass = colorClass + "u-color-2"
        } else if (this.props.order % 4 == 2){
          colorClass = colorClass + "u-color-3"
        } else {
          colorClass = colorClass + "u-color-4"
        }

        return (
            <div className={backgroundGrey}> {/* turns white if it's your turn */}
                <div className="PlayerIcon-left">
                  <div className="PlayerIcon-order">{this.props.order}</div>
                  <div className={colorClass}></div>
                  <span className="PlayerIcon-right">
                      {this.props.playername}
                  </span>
                </div>
                

            </div>
          
        );
      }

}
export default PlayerIcon;