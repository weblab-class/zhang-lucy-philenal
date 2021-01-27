import React, { Component } from "react";
import "../../utilities.css";
import "./MadeWithLuv.css";
/* const heart = require("../../../dist/heart.png"); */
class MadeWithLuv extends Component {
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
        <div className="MadeWithLuv">
          made with <span className="MadeWithLuv-heart" alt="Heart" ></span>
          <br></br> lucy + philena
        </div>
      </>
    );
  }
}

export default MadeWithLuv;