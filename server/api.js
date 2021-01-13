/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const BOARD_WIDTH_BLOCKS = 20;
const BOARD_HEIGHT_BLOCKS = 20;


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
const Board = require("./models/board");

router.get("/board", (req, res) => {
  Board.find({_id: req.query._id}).then((board) => res.send(board));
});

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
    newPixels.push({color: "none", filled: false});
  }

  const newBoard = new Board({
    _id: 0,
    width: BOARD_WIDTH_BLOCKS,
    height: BOARD_HEIGHT_BLOCKS,
    pixels: newPixels,
  });
  
  const newGame = new Game({
    _id: req.body.game_id, // TODO: change this
    host_id: req.body.user_id,
    players: [],
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
  Game.find({ _id: req.query.game_id }).then((game) => {
    res.send(game);
  });
});

router.put("/game/join", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((game) => {
    res.send(game);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
