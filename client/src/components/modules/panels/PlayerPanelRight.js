import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

import TextEntry from "../TextEntry.js";
import "../../../utilities.css";
import "./PlayerPanel.css";
import "./PlayerPanelRight.css";

import { put} from "../../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class PlayerPanelRight extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onGuessEntry = (guess) => {
    this.setState({guess: guess});
  }

  submitGuess = () => {
    let guess = this.state.guess;
    this.setState({guess: ""});

    console.log(`Submitting guess for ${guess}...`);
    put("api/game/guess", {
      game_id: this.props.game_id,
      user_id: this.props.user_id,
      guess: guess,
    }).then((res) => {
      console.log(res);
      if(res.message == "correct") {
        console.log("correct!!");
        this.props.callback(guess);
      } else {
        console.log(res);
        console.log("incorrect");
        // TODO: maybe hints if they are close?
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <>
        <div className="PlayerPanelRight">
          <div className="PlayerPanelRight-chatBox"></div>
          {(!this.props.isGuesser) &&
          <div><TextEntry callback={this.onGuessEntry}/>
            <button 
              className="NewGame-button u-color-1"
              onClick={this.submitGuess}
            >guess</button></div> 
          }
          {/* <div className="PlayerPanelRight-columnBlocks">
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/skeleton" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-1">settings</button>
                
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/newgame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-2">how to play</button>
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/joingame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-3">my wall</button>
                </Link>
            </div>
            <div className="PlayerPanelRight-linkContainer">
                <Link to="/newgame/" className="PlayerPanelRight-link">
                    <button className="PlayerPanelRight-button u-color-4">new game</button>
                </Link>
            </div>
        </div>
         */}
        </div>

        
      </>
    );
  }
}

export default PlayerPanelRight;
