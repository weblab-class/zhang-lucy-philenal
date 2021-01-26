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
      }

      render() {
        return (
            <div className={this.props.isMyTurn ? 'PlayerIcon-backgroundWhite PlayerIcon-container': 'PlayerIcon-container'}> {/* turns white if it's your turn */}
                <div className="PlayerIcon-left u-flex-alignCenter">
                  <div className="GuesserIcon-order">0</div>
                  <div className="PlayerIcon-icon u-color-grey"></div>
                  <div className="PlayerIcon-right">
                    {this.props.guesser_name}
                </div>
                </div>
            </div>
          
        );
      }

}
export default GuesserIcon;