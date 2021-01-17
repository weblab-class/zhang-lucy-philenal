//should contain a square for player + player's name
// guesser's name should be passed as a prop from start/join game screen from somewhere
import React, { Component } from "react";

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
                  <div className="GuesserIcon-order">0</div>
                  <div className="PlayerIcon-icon u-color-white"></div>
                  <div className="PlayerIcon-right">
                    {/* later on we will pass props */}
                    {this.props.guesser_name}
                    {/* Lucy */}
                    
                </div>
                </div>
                
               
            </div>
          
        );
      }

}
export default GuesserIcon;