import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Login from "./pages/Login.js";
import Skeleton from "./pages/Skeleton.js";
import Start from "./pages/Start.js";
import JoinGame from "./pages/JoinGame.js";
import NewGame from "./pages/NewGame.js";
import Guesser from "./pages/Guesser.js";
import Pixeler from "./pages/Pixeler.js";

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
      userId: undefined,
    };
  }

  componentDidMount() {
    // TODO
    // get("/api/whoami").then((user) => {
    //   if (user._id) {
    //     // they are registed in the database, and currently logged in.
    //     this.setState({ userId: user._id });
    //   }
    // });
  }

  handleLogin = (res) => {
    // TODO
    console.log("reeeee");
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      // TODO: comment back in after sockets
      // post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    // TODO
    console.log("logged out")
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <Router>
          <Skeleton
            path="/skeleton"
          />
          <Login path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <Start path="/start" />
          <JoinGame path="/joingame" />
          <JoinGame path="/newgame" />
          <Guesser path="/guesser" />
          <Pixeler path="/pixeler" />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
