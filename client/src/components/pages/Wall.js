import { navigate } from "@reach/router";
import React, { Component } from "react";
import { get } from "../../utilities";
import "../../utilities.css";
import Picture from "../modules/Picture";
import "./Wall.css";

//when click on picture (make picture a button), open up a modal with larger view picture
//change picture.width + height? with transitionsModal + the name of word
//when hover on picture, overlay with word + random color + scale a little

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
      if (i%4 == 0){
        correct_pictures.push(
          <div className="Wall-pictureContainer">
            <div className="Wall-picture">
              <Picture
              picture_width_blocks={picture.width}
              picture_height_blocks={picture.height}
              pixels={picture.pixels}
              />
            </div>
            <div className="Wall-overlay-fame u-color-1">
              <div className="Wall-pictureCaption-fame">
                {picture.title}
              </div>
            </div>
          </div>
        );

      } else if (i%4 ==1) {
        correct_pictures.push(
          <div className="Wall-pictureContainer">
            <div className="Wall-picture">
              <Picture
              picture_width_blocks={picture.width}
              picture_height_blocks={picture.height}
              pixels={picture.pixels}
              />
            </div>
            <div className="Wall-overlay-fame u-color-2">
              <div className="Wall-pictureCaption-fame">
                {picture.title}
              </div>
            </div>
          </div>
        );
      } else if (i%4 == 2) {
        correct_pictures.push(
          <div className="Wall-pictureContainer">
            <div className="Wall-picture">
              <Picture
              picture_width_blocks={picture.width}
              picture_height_blocks={picture.height}
              pixels={picture.pixels}
              />
            </div>
            <div className="Wall-overlay-fame u-color-3">
              <div className="Wall-pictureCaption-fame">
                {picture.title}
              </div>
            </div>
          </div>
        );
      } else {
        correct_pictures.push(
          <div className="Wall-pictureContainer">
            <div className="Wall-picture">
              <Picture
              picture_width_blocks={picture.width}
              picture_height_blocks={picture.height}
              pixels={picture.pixels}
              />
            </div>
            <div className="Wall-overlay-fame u-color-4">
              <div className="Wall-pictureCaption-fame">
                {picture.title}
              </div>
            </div>
          </div>
        );
      }
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
          <div className="Wall-overlay-shame">
            <div className="Wall-pictureCaption-shame">
              {picture.title}
            </div>
          </div>
        </div>
      );
    }

    return (
      <>    
      <button onClick={()=>{navigate('/')}}>back</button>
      <div className="Wall-page">  
        <div className="Wall-container-fame">
          <div className="Wall-title-fame">hall of fame</div>
          <div className="Wall-rowPixel">
            <div className="Wall-pixels u-color-1"></div>
            <div className="Wall-pixels u-color-2"></div>
            <div className="Wall-pixels u-color-3"></div>
            <div className="Wall-pixels u-color-4"></div>
          </div>
          <div className="Wall-gallery">
            {correct_pictures}
          </div> 
        </div> 

        <div className="Wall-container-shame">
          <div className="Wall-title-shame">wall of shame</div>
          <div className="Wall-rowPixel">
            <div className="Wall-pixels u-color-grey"></div>
            <div className="Wall-pixels u-color-grey"></div>
            <div className="Wall-pixels u-color-grey"></div>
            <div className="Wall-pixels u-color-grey"></div>
          </div>
          <div className="Wall-gallery">
            {incorrect_pictures}
          </div>  
        </div>
      </div>
      </>
    );
  }
}

export default Wall;
