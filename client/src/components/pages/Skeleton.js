import React, { Component } from "react";
import { Router, Link } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Skeleton.css";
import { navigate } from "@reach/router";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "556090196938-vtf380cpnsqvbdvdhhq94ph113roaube.apps.googleusercontent.com";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        {/* {this.props.user_id ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )} */}
        <h1>how to play</h1>
        <button onClick={()=>{navigate('/')}}>back</button>
        <p>pixonary is an online drawing game that allows players to collaboratively draw a word for the guesser to guess -- all with pixels! for each word, players will be assigned to be either a pixeler or guesser. the pixelers are ordered randomly such that they can only pixel on the shared canvas on their turn, while the guesser can guess the word at any point in time.</p>
        <div className="Skeleton-grid u-flex u-flex-justifyCenter">
          <div className="Skeleton-pixelBox u-color-1">
            <div className="u-flex u-flex-justifyCenter">
              <h2>start</h2>
            </div>
            <div className="u-flex u-flex-justifyCenter">
            <p>you can either create a new game or join a game. to create a game, enter a game id (it can be anything!) and submit. send the game id to your friends so that they can join the game! after, you'll be redirected to a lobby, where you can adjust the game settings.</p>
            </div>
          </div>
          <div className="Skeleton-pixelBox u-color-2">
            <div className="u-flex u-flex-justifyCenter">
              <h2>settings</h2>
            </div>
            <div className="u-flex u-flex-justifyCenter">
            <ul>
              <li>word pack: set of words you'll be pixeling.</li>
              <li>round: during each round, every player will have a chance at being a guesser for a word. hence, there will be (# of players) words used in a round.</li>
            </ul>
            </div>
          </div>
        </div>
        

        
        {/* <Router>
          <Link to="/pixeler">
            <button className="newGameButton" type="button">
              New Game
            </button>
          </Link>
        </Router> */}

      </>
    );
  }
}

export default Skeleton;
