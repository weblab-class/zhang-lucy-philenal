/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const BOARD_WIDTH_BLOCKS = 3;
const BOARD_HEIGHT_BLOCKS = 3;
var mongoose = require('mongoose');


const MY_NAME = "Fluffy Corgi";

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// TODO: Fix these API's, these are just the nonsocket versions
const Game = require("./models/game");
// const Board = require("./models/board");

// TODO: Move stuff below socket
//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/game/new", (req, res) => {
  const newPixels = [];
  const numPixels = BOARD_WIDTH_BLOCKS * BOARD_HEIGHT_BLOCKS;

  for (let i = 0; i < numPixels; i++) {
    newPixels.push({id: i, color: "none", filled: false});
  }

  const newBoard = {
    _id: 0,
    width: BOARD_WIDTH_BLOCKS,
    height: BOARD_HEIGHT_BLOCKS,
    pixels: newPixels,
  };

  const newGame = new Game({
    _id: req.body.game_id, // TODO: change this
    host_id: req.body.user_id,
    players: [{name: req.body.user_name, googleid: req.body.user_id}],
    board: newBoard,
    started: false,
    finished: false,
    wordpack: "default",
    guesses: [],
    guesser: null,
  });

  newGame.save().then((game) => res.send(game));

});


router.get("/game/get", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games);
  });
});

router.get("/game/canvas", (req, res) => {
  // TODO: Check if the user is a pixeler
  console.log("what");
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games.map((g) => g.board));
  });
});

router.put("/game/join", (req, res) => {
  // TODO: check that the player hasn't joined already
  Game.findByIdAndUpdate(
    (req.body.game_id),
    req.body.game,
    {new: true},
    (err, todo) => {
      console.log(err);
      console.log(todo);
    }
  ).then((game) => {
    res.send(game);
  });
  //shouts the updated players list + the game id to all connected sockets
  socketManager.getIo().emit("players_and_game_id", 
  {
    players: req.body.players, 
    game_id: req.body.game_id
  });
});

router.put("/game/start", (req, res) => { //changes started --> true
  console.log("START");
  Game.findByIdAndUpdate(
    (req.body.game_id),
    req.body.game,
    {new: true},
    (err, todo) => {
      console.log(err);
      console.log(todo);
    }
  ).then((game) => {
    //tells everyone that game started!
    socketManager.getIo().emit("game_id_started", req.body.game_id);
    res.send(game);
  });
  
});

router.put("/game/pixel", (req, res) => {
  // TODO: check that the player is a player and pixeler
  Game.findByIdAndUpdate(
    (req.body.game_id),
    req.body.game,
    {new: true},
    (err, todo) => {
      console.log(err);
      console.log(todo);
    }
  ).then((game) => {
    res.send(game);
  });

  //shouts the updated pixels + the game id to all connected sockets
  // TODO: change this idk
  // socketManager.getIo().emit("pixels_and_game_id", 
  // {
  //   pixels: req.body.game.pixels, 
  //   game_id: req.body.game_id
  // });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
