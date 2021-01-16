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
 * @param {String} _id
 * @param {Boolean} isMyTurn
 * @param {Number} order
 */

class PlayerIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

      componentDidMount() {
        // remember -- api calls go here!
      }

      render() {
        /* if (this.state.isMyTurn == true){
          //document.getElementsByClassName("PlayerIcon-container").style.background="white";
          let containerStyle = {backgroundColor: 'white'};
        } else{
          let containerStyle = {backgroundColor: 'transparent'};
        } */

        return (
            <div className={this.props.isMyTurn ? 'PlayerIcon-backgroundWhite PlayerIcon-container': 'PlayerIcon-container'}> {/* turns white if it's your turn */}
                <div className="PlayerIcon-left u-flex-alignCenter">
                  <div className="PlayerIcon-order">{this.props.order}</div>
                  <div className="PlayerIcon-icon u-color-1">
                  </div>
                </div>
                
                <span className="PlayerIcon-right">
                    {/* later on we will pass props */}
                    {this.props.playername}
                    {/* Lucy */}
                    
                </span>
            </div>
          
        );
      }

}
export default PlayerIcon;