import React, { Component, useState} from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";
import NotFound from "./pages/NotFound.js";
import Start from "./pages/Start.js";
import HowToPlay from "./pages/HowToPlay.js";
import Lobby from "./pages/Lobby.js";
import JoinGame from "./pages/JoinGame.js";
import NewGame from "./pages/NewGame.js";
import Guesser from "./pages/Guesser.js";
import GameAlreadyStarted from "./pages/GameAlreadyStarted.js";
import Pixeler from "./pages/Pixeler.js";
import Player from "./pages/Player.js";
import Wall from "./pages/Wall.js";
import "../utilities.css";
import "../variables.scss";
import "./App.scss";


import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

const DEFAULT_DARK = false;

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);

    this.state = {
      theme: "",
      _id: undefined,
    };
  }

  toggleDarkMode = (toggle) => {
    if (toggle) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem('theme', "dark");

    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem('theme', "light");
    }
  }

  componentWillUnmount () {
    this.is_mounted = false;
  }

  componentDidMount() {
    let theme = localStorage.getItem('theme') == "dark" ? true : false;
    if (theme) {
      this.toggleDarkMode(theme);
    } else {
      this.toggleDarkMode(DEFAULT_DARK);
    }
    this.is_mounted = true;
    get("/api/whoami").then((user) => {
      console.log("whoami");
      console.log(user);
      if (user._id && this.is_mounted) {
        // they are registed in the database, and currently logged in.
        this.setState({ _id: user._id });
        this.setState({ user_name: user.name });
      }
    });
  }

  handleLogin = (res) => {
    const userToken = res.credential
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ _id: user._id, user_name: decodedCredential.name});
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    console.log("logged out")
    this.setState({ _id: undefined, user_name: undefined });
    post("/api/logout");
  };

  render() {

    return (
      <>
        <div className={`App ${this.state.theme}`}>
          <Router>
            <HowToPlay
              path="/howtoplay"
              user_name={this.state.user_name}
            />
            <Start 
              className="dark"
              toggleDarkMode={this.toggleDarkMode}
              defaultDark={DEFAULT_DARK}
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              _id={this.state._id}
              user_name={this.state.user_name}
            />
            <Lobby path="/lobby"/>
            <JoinGame path="/joingame" />
            <NewGame path="/newgame" />
            <GameAlreadyStarted path="/gamealreadystarted"/>
            <Player path="/player" />
            <Wall path="/wall" user_name={this.state.user_name}/>
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
