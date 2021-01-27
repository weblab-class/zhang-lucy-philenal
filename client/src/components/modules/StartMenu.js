import { Link } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import "../../variables.scss";
// import "../../utilities.scss";
// import "../App.scss";
import "./StartMenu.css";

/**
 * StartMenu is contained in the Start.js page. It has buttons that go to New Game, Join Game, Wall, Rules.
 * @param user_id google id
 * @param user_name google name
 */
class StartMenu extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
          <div className="StartMenu-buttonsRow">
              <div className="StartMenu-linkContainer">
                  <Link to="/howtoplay" state={{
                    user_id: this.props.user_id,
                    user_name: this.props.user_name,
                  }}
                  >
                      <button className="StartMenu-button u-color-1 u-pointer"></button>
                  </Link>
                  how to play
              </div>
              <div className="StartMenu-linkContainer">
                  <Link to="/newgame" state={{
                    user_id: this.props.user_id,
                    user_name: this.props.user_name,
                  }}>
                    <button className="StartMenu-button u-color-2 u-pointer"></button>
                  </Link>
                  new game
              </div>
              <div className="StartMenu-linkContainer">
                  <Link to="/joingame" state={{
                    user_id: this.props.user_id,
                    user_name: this.props.user_name,
                  }}>
                    <button className="StartMenu-button u-color-3 u-pointer"></button>
                  </Link>
                  join game
              </div>
              <div className="StartMenu-linkContainer">
                  <Link to="/wall" state={{
                    user_id: this.props.user_id,
                    user_name: this.props.user_name,
                  }}>
                    <button className="StartMenu-button u-color-4 u-pointer"></button>
                  </Link>
                  wall
              </div>
          </div>
      </>
    );
  }
}

export default StartMenu;
