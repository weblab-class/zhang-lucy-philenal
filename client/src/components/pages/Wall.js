import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Wall.css";
import Picture from "../modules/Picture";

import { get, post } from "../../utilities";

import { navigate } from "@reach/router";

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
      correct_pictures: [],
      incorrect_pictures: [],

    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    console.log(this.props);
    get("/api/user/images", {
      user_id: this.props.location.state.user_id
    }).then((pictures) => {
      console.log(pictures);
      this.setState({
        correct_pictures: pictures.correct,
        incorrect_pictures: pictures.incorrect,
      });
    }).catch((err) => {
      console.log(`Error: ${err}`);
    })
  }

  render() {
    let correct_pictures = []
    for (let i = 0; i < this.state.correct_pictures.length; i++) {
      let picture = this.state.correct_pictures[i];
      correct_pictures.push(
        <div className="Wall-pictureContainer">
          <Picture
          picture_width_blocks={picture.width}
          picture_height_blocks={picture.height}
          pixels={picture.pixels}
          />
          <div className="Wall-pictureCaption">
            {picture.title}
          </div>
          
        </div>
      );
    }

    let incorrect_pictures = []
    for (let i = 0; i < this.state.incorrect_pictures.length; i++) {
      let picture = this.state.incorrect_pictures[i];
      incorrect_pictures.push(
        <div className="Wall-pictureContainer">
          <Picture
          picture_width_blocks={picture.width}
          picture_height_blocks={picture.height}
          pixels={picture.pixels}
          />
          <div className="Wall-pictureCaption">
            {picture.title}
          </div>
          
        </div>
      );
    }

    return (
      <>
            <h1>Hall of Fame</h1>
            <button onClick={()=>{navigate('/')}}>back</button>
            <div className="Wall-container">
              {correct_pictures}
            </div>  
            <h1>Wall of Shame</h1>
            <div className="Wall-container">
              {incorrect_pictures}
            </div> 

      </>
    );
  }
}

export default Wall;
