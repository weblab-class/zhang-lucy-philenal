import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../../utilities.css";
import "./PlayerPanel.css";

class PlayerPanelTop extends Component {
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
        <div className="PlayerPanelTop">pixonary</div>
      </>
    );
  }
}

export default PlayerPanelTop;
