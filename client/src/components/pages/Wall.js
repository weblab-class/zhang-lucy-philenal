import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
// import "./Wall.css";

import { get, post } from "../../utilities";

import { navigate } from "@reach/router";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * Wall page is the page that shows all the correctly guessed images
 * TODO: change the user schema to contain a list of all games you've played before
 * @param user_name
 * @param user_id 
 */
class Wall extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    // get("/api/game/get", {game_id: this.props.game_id})
    console.log(this.props);
  }

  render() {
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <h1>Wall of Fame</h1>
            <button onClick={()=>{navigate('/')}}>back</button>


      </>
    );
  }
}

export default Wall;
