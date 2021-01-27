import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import "./HowToPlay.css";
import ToggleButton from "../modules/ToggleButton";
import MadeWithLuv from "../modules/MadeWithLuv.js";
const GOOGLE_CLIENT_ID = "556090196938-vtf380cpnsqvbdvdhhq94ph113roaube.apps.googleusercontent.com";

class HowToPlay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className={`u-welcome`}>
          <div>
            hello, {this.props.user_name}! 
          </div>
          <ToggleButton/>
        </div>
        <div className="u-back-button-container">
              <button onClick={()=>{navigate('/')}}>back</button>
            </div>     
        <div className="HowToPlay-container">
          <div className="HowToPlay-title">
            how to play
          </div>
          <div className="NewGame-rowPixel">
            <div className="NewGame-pixels u-color-1"></div>
            <div className="NewGame-pixels u-color-2"></div>
            <div className="NewGame-pixels u-color-3"></div>
            <div className="NewGame-pixels u-color-4"></div>
          </div>
          <div className="HowToPlay">
            <div className="HowToPlay-header"> pixonary</div> 
            <div>
            pictionary + tag-team + pixels <br></br>{/* that allows players to collaboratively draw a word for the guesser to guess -- all with pixels! */}
            <br></br> 
            <i>=chef's kiss</i>{/* for each word, players will be assigned to be either a pixeler or guesser. the pixelers are ordered randomly such that they can only pixel on the shared canvas on their turn, while the guesser can guess the word at any point in time. */}
              </div>
            </div>
            
            <div className="HowToPlay-grid u-flex u-flex-justifyCenter">
              <div className="HowToPlay-pixelBox u-color-1">
                  <div className="u-flex u-flex-justifyCenter">
                  <div className="HowToPlay-header">rules</div> 
                  </div>
                  <div className="u-flex u-flex-justifyCenter">
                  <ul>
                    <li><span className="HowToPlay-bold">team: </span> of pixelers + one guesser</li>
                    <li><span className="HowToPlay-bold">pixelers: </span> take turns pixeling together one word</li>
                    <li><span className="HowToPlay-bold">guesser: </span> can guess at any time</li>
                    <li><span className="HowToPlay-bold">pixel: </span> click to draw, change color, or clear the pixel</li>
                  </ul>
                </div>
              </div>
              <div className="HowToPlay-pixelBox u-color-2">
                <div className="u-flex u-flex-justifyCenter">
                <div className="HowToPlay-header">start</div> 
                </div>
                <div className="u-flex u-flex-justifyCenter">
                <ul>
                  <li><span className="HowToPlay-bold">create game: </span> game id can be anything :)</li>
                  <li><span className="HowToPlay-bold">join game: </span> enter in friend's game id</li>
                  <li><span className="HowToPlay-bold">lobby: </span> where you'll be redirected to. adjust game settings here!</li>
                </ul>
                </div>
              </div>
              <div className="HowToPlay-pixelBox u-color-3">
                <div className="u-flex u-flex-justifyCenter">
                <div className="HowToPlay-header">settings</div> 
                </div>
                <div className="u-flex u-flex-justifyCenter">
                <ul>
                  <li><span className="HowToPlay-bold">word pack: </span> set of words to pixel</li>
                  <li><span className="HowToPlay-bold">round: </span> there will be (# of players) words per round. each player will have the chance to be a guesser.</li>
                  <li><span className="HowToPlay-bold">pixels per person: </span> limit on # of pixels each player can use. difficulty depends on # of players + % of the # of pixels in the board</li>
                </ul>
              </div>
            </div>
            <div className="HowToPlay-pixelBox u-color-4">
                <div className="u-flex u-flex-justifyCenter">
                <div className="HowToPlay-header">wall</div> 
                </div>
                <div className="u-flex u-flex-justifyCenter">
                <ul>
                  <li><span className="HowToPlay-bold">aka: </span> <br></br>hall of fame :) + wall of shame :(</li>
                  <li><span className="HowToPlay-bold">contains: </span><br></br> your correct :) + incorrect :( drawings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

         
        
        <MadeWithLuv/>

        
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

export default HowToPlay;
