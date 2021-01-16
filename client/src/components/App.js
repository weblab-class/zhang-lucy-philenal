import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Start from "./pages/Start.js";
import Skeleton from "./pages/Skeleton.js";
import Lobby from "./pages/Lobby.js";
import JoinGame from "./pages/JoinGame.js";
import NewGame from "./pages/NewGame.js";
import Guesser from "./pages/Guesser.js";
import Pixeler from "./pages/Pixeler.js";
import Player from "./pages/Player.js";
import Wall from "./pages/Wall.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      console.log(user);
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ user_id: user._id });
        this.setState({ user_name: user.name });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ user_id: user._id, user_name: res.profileObj.name});
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    console.log("logged out")
    this.setState({ user_id: undefined, user_name: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <Router>
          <Skeleton
            path="/skeleton"
          />
          <Start path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            user_id={this.state.user_id}
            user_name={this.state.user_name}
          />
          <Lobby path="/lobby"/>
          <JoinGame path="/joingame" />
          <NewGame path="/newgame" />
          <Guesser path="/guesser" game_id="bob"/>
          <Pixeler path="/pixeler" />
          <Player path="/player" />
          <Wall path="/wall" />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
