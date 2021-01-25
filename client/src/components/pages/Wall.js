import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Wall.css";
import Picture from "../modules/Picture";

import { get, post } from "../../utilities";

import { navigate } from "@reach/router";

let smallPicture = [1,0,1,0,0,0,1,1,1];
let bigPixels = [20,53,101,134,204,245,256,345,356,387];
let bigPicture = [];
for(let i = 0; i < 400; i++) {
  bigPicture[i] = 0;
}
for(let j = 0; j < bigPixels.length; j++) {
  bigPicture[bigPixels[j]] = 1;
  bigPicture[bigPixels[j]] = 1;
}
// let pictures = [smallPicture, bigPicture];

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
      pictures: [],//[smallPicture, bigPicture],

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
        pictures: pictures,
      });
    }).catch((err) => {
      console.log(`Error: ${err}`);
    })
  }

  render() {
    let pictures = []
    // let hw = [3,20];
    // let titles = ["cat", "frog"];
    for (let i = 0; i < this.state.pictures.length; i++) {
      let picture = this.state.pictures[i];
      pictures.push(
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
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <h1>Hall of Fame</h1>
            <button onClick={()=>{navigate('/')}}>back</button>
            <div className="Wall-container">
              {pictures}
            </div>  
      </>
    );
  }
}

export default Wall;
