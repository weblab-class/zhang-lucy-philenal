/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

var mongoose = require('mongoose');

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const Game = require("./models/game");
const Logic = require("./logic");

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
  const newGame = Logic.newGame(req);
  newGame.save().then((game) => res.send(game));
});

//TODO: update logic when pixeler ends turn, or pixelsLeft = 0
//
router.post("/game/endTurn", (req, res) => {
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    game.turn +=1; //adds turn
    return game.save().then((updatedGame) => { //updates game document and then shouts the change
      socketManager.getIo().emit("endedTurn", 
      {
        turn: updatedGame.turn, 
        game_id: updatedGame._id,
      });
      res.send(updatedGame);
    })
  })
  
});

router.get("/game/get", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games);
  });
});

router.get("/game/player_status", (req, res) => {
  console.log(req);
  Game.find({ _id: req.query.game_id }).then((games) => {
    console.log("player status");
    console.log(games);
    if (games.length == 0) {
      res.send([]);
    } else {
      console.log(`USER: ${req.query.user_id}`);
      if (games[0].guesser.googleid == req.query.user_id) {
        res.send({status: "guesser"});
      } else {
        for (let i = 0; i < games[0].players.length; i++) {
          if (games[0].players[i].googleid == req.query.user_id) {
            res.send({status: "pixeler"});
            return; //idk if this is necessary
          }
        }
        res.send({status: "neither"});
      }
    }
  });
});

router.put("/game/guess", (req, res) => {
  console.log(req.body);
  Game.find({ _id: req.body.game_id }).then((games) => {
    console.log(games);
    // TODO: add guesser check
    if (games.length == 0 ){//|| req.body.user_id != games[0].guesser.googleid ) {
      res.status(400).send({ msg: "you are not allowed to guess here" });
    } else {
      if (games[0].word == req.body.guess) {
        res.send({message: "correct"});
      } else {
        res.send({message: "incorrect"});
      }
    }

  })
})

router.get("/game/canvas", (req, res) => {
  // TODO: Check if the user is a pixeler
  console.log("what");
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games.map((g) => g.board));
  });
});

router.put("/game/join", (req, res) => {
  // TODO: check that the player hasn't joined already
  // TODO: check that game hasn't started already
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
  //TODO: (philena) change this to socket room for higher efficiency!!!!
  //shouts the updated players list + the game id to all connected sockets
  socketManager.getIo().emit("players_and_game_id", 
  {
    players: req.body.players, 
    game_id: req.body.game_id
  });
});

router.put("/game/start", (req, res) => { //changes started --> true
  const initializedGame = Logic.initializeGame(req.body.game);
  console.log("init game");
  console.log(initializedGame);
  Game.findByIdAndUpdate(
    (req.body.game_id),
    initializedGame,
    {new: true},
    (err, todo) => {
      console.log(err);
      console.log(todo);
    }
  ).then((game) => {
    //TODO: (philena) change this to socket room for higher efficiency!!!!
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
  //TODO: change this idk
  socketManager.getIo().emit("board_and_game_id", 
  {
    board: req.body.game.board,
    // pixels: req.body.game.pixels, 
    game_id: req.body.game_id
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
