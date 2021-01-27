import { navigate } from "@reach/router";
import React, { Component } from "react";
import ReactLoading from 'react-loading';
import { get } from "../../utilities";
import Picture from "../modules/Picture";
import "./Wall.css";
import "../../utilities.css";

//when click on picture (make picture a button), open up a modal with larger view picture
//change picture.width + height? with transitionsModal + the name of word
//when hover on picture, overlay with word + random color + scale a little

/**
 * Wall page is the page that shows all the correctly guessed images
 * TODO: change the user schema to contain a list of all games you've played before
 * 
 * @param user_id 
 */
class Wall extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      correct_pictures: [],
      incorrect_pictures: [],
      isLoading: true,
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
        user_name: pictures.user_name,
      }, () => {
        this.setState({isLoading: false})
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
          <div className="Wall-picture">
            <Picture
            picture_width_blocks={picture.width}
            picture_height_blocks={picture.height}
            pixels={picture.pixels}
            />
          </div>
          <div className={`Wall-overlay-fame u-color-${i%4+1}`}>
            <div className="Wall-pictureCaption-fame">
              {picture.title}
            </div>
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
          <div className="Wall-overlay-shame">
            <div className="Wall-pictureCaption-shame">
              {picture.title}
            </div>
          </div>
        </div>
      );
    }
    if (this.state.user_name ==null){
      return (<div></div>)
    } else {
      return (
        <>
        <div className="u-welcome">hello, {this.state.user_name}! </div>    
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
            {this.state.isLoading ? 
              <div className="LoadingScreen"> 
                  <ReactLoading type={"bars"} color={"grey"} className={"ReactLoading-bar"}/>
              </div>  : 
            <div className="Wall-gallery">
              {correct_pictures}
            </div> 
            }
          </div> 
          <div className="Wall-container-shame">
            <div className="Wall-title-shame">wall of shame</div>
            <div className="Wall-rowPixel">
              <div className="Wall-pixels u-color-grey"></div>
              <div className="Wall-pixels u-color-grey"></div>
              <div className="Wall-pixels u-color-grey"></div>
              <div className="Wall-pixels u-color-grey"></div>
            </div>
            {this.state.isLoading ? 
              <div className="LoadingScreen"> 
                  <ReactLoading type={"bars"} color={"grey"} />
              </div> : 
            <div className="Wall-gallery">
              {incorrect_pictures}
            </div>}
          </div>
        </div>
        </>
      );
    }
    
  }
}

export default Wall;
