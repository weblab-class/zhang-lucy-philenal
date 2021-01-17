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
const Game = require("./models/game");
const Logic = require("./logic");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  console.log(req.user);
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
  const filter = { _id: req.body.user_id };
  const update = { game_id: req.body.game_id };
  User.findOneAndUpdate(filter, update, {
    new: true,
  }).then((res)=>{
    console.log(res);
  });

  const newGame = Logic.newGame(req);
  newGame.save().then((game) => res.send(game));
});

router.post("/user/leave", (req, res) => {
  console.log("what");
  // console.log(_id==mongoose.Types.ObjectId(req.body.user_id));
  const filter = { _id: req.body.user_id };
  const update = { game_id: null };
  User.findOneAndUpdate(
    filter, 
    update, {
    new: true}
  ).then((res) => {
    console.log("hello");
    console.log(res);
  });

  // TODO: update host
  const filter2 = { _id: req.body.game_id };
  const update2 = {
    $pull:{ 
      players: { _id: req.body.user_id },
      pixelers: { _id: req.body.user_id }
    }
  };

  Game.findOneAndUpdate(
    filter2, 
    update2, 
    {"new": true},
    ).then((game)=>{
      console.log("here");
      console.log(game);
      res.send({"success": true});
  });

  Game.findOne(filter2, 
    function (err, game) {
    game.guesser = game.guesser._id == req.body.game_id ? null : game.guesser;
    game.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
    });
});


});

//TODO: update logic when pixeler ends turn, or pixelsLeft = 0
//
router.post("/game/endTurn", (req, res) => {
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    game.turn += 1; //adds turn
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

router.get("/user/get", (req, res) => {
  console.log(req.query);
  
  User.find({ _id: mongoose.Types.ObjectId(req.query.user_id) }).then((users) => {
    res.send(users);
  });
});

// TODO: kill this bad function lol
router.get("/game/get", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games);
  });
});

router.get("/game/player_status", (req, res) => {
  console.log("player status...");
  console.log(req.query);
  User.find({_id: req.query.user_id}).then((users) => {
    if (users.length == 0 || !users[0].game_id) {
      res.send({status:"not in game"});
    } else {
      Game.find({ _id: users[0].game_id }).then((games) => {
        console.log("found games:");
        console.log(games);
        if (games.length == 0) {
          res.send({status:"not in game"});
        } else {
          console.log(`USER: ${req.query.user_id}`);
          if (games[0].guesser._id == req.query.user_id) {
            res.send({ game_id: games[0]._id, status: "guesser" });
          } else {
            for (let i = 0; i < games[0].players.length; i++) {
              if (games[0].players[i]._id == req.query.user_id) {
                res.send({ game_id: games[0]._id, status: "pixeler" });
              }
            }
            res.send({status:"not in game"});
          }
        }
      });

    }
  })


});

router.get("/game/canvas", (req, res) => {
  // TODO: Check if the user is a pixeler
  // console.log("what");
  Game.find({ _id: req.query.game_id }).then((games) => {
    res.send(games.map((g) => g.board));
  });
});

router.post("/game/join", (req, res) => {
  const filter = { _id: req.body.user_id };
  const update = { game_id: req.body.game_id };
  User.findOneAndUpdate(filter, update, {
    new: true,
  }).then((res)=>{
    console.log(res);
  });

  console.log(req.body);
  Game.findOne({_id: req.body.game_id}, 
    function (err, game) {
      // if player not already in game
      if (game.players) {
        let filteredPlayers = game.players.filter((p) => {p && (p._id == req.body.user_id)});
        console.log("filter");
        console.log(filteredPlayers);
        if (filteredPlayers.length == 0) {
          game.players = game.players.concat([{
            _id: req.body.user_id, 
            name: req.body.user_name,
            game_id: req.body.game_id,
          }]);
        }
      }
      
      game.save(function (err) {
        if(err) {
          console.log(err);
            console.error('ERROR!');
        }
      })
    }).then((updatedGame) => {
      // TODO: Fix this
      console.log("updateds");
      console.log(updatedGame);
      socketManager.getIo().emit("players_and_game_id", 
      {
        players: updatedGame.players, 
        game_id: updatedGame._id
      });
      res.send({status: "success"});
  });
  //TODO: (philena) change this to socket room for higher efficiency!!!!
  //shouts the updated players list + the game id to all connected sockets
 
});

router.put("/game/guess", (req, res) => {
  console.log(req.body);
  Game.find({ _id: req.body.game_id }).then((games) => {
    const noGamesFound = games.length == 0;
    const emptyGuess = req.body.guess.length == 0;
    // TODO:  put this back in
    const invalidUser = false;//req.body.user_id != games[0].guesser._id;
    
    if (noGamesFound || emptyGuess || invalidUser ) {
      res.status(400).send({ msg: "you are not allowed to guess here" });
    } else {
      let game = {...games[0]};
      console.log(game._doc.guesses);
      game._doc.guesses = game._doc.guesses.concat([req.body.guess]);
      Game.findByIdAndUpdate(
        (req.body.game_id),
        game,
        {new: true},
        (err, todo) => {
          console.log(err);
          console.log(todo);
        }
      ).then((updatedGame) => {
        socketManager.getIo().emit("guess", 
        {
          guesses: updatedGame._doc.guesses
        });
        if (games[0].word == req.body.guess) {
          res.send({message: "correct"});
        } else {
          res.send({message: "incorrect"});
        }
      });
    }
  })
})

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
  ).then((updatedGame) => {
    socketManager.getIo().emit("board_and_game_id", 
    {
      pixel_id: req.body.pixel_id,
      pixel_id_filled: req.body.pixel_id_filled,
      board: updatedGame.board,
      // pixels: req.body.game.pixels, 
      game_id: updatedGame._id
    });
    res.send(updatedGame);
  });

  //shouts the updated pixels + the game id to all connected sockets
  //TODO: change this idk

});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
