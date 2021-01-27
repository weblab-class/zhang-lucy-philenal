/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

// lol please centralize this
const BOARD_WIDTH_BLOCKS = 20;
const BOARD_HEIGHT_BLOCKS = 20;

var mongoose = require('mongoose');

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Game = require("./models/game");
const Board = require("./models/board");
const Logic = require("./logic");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//word pack
const wordPacks = Logic.wordpacks;

const sessionValues = [1,2,3,4,5];

// value is the fraction of the pixels of the canvas that are available to
// the users. For example, an easy game with 400 pixels on the canvas and 
// 3 players (2 pixelers 1 guesser) give the players (400 * 0.5 * 1/2) pixels 
// each [100 px].
const difficulties = {"easy": 0.4, "medium": 0.3, "hard": 0.2};

//sends list of possible wordpacks
router.get("/game/wordPacks", (_, res)=> {
  res.send(Object.keys(wordPacks))
})

//sends list of possible sessionValues
router.get("/game/sessionValues", (_, res)=> {
  res.send(Object.values(sessionValues))
})

//sends list of possible difficulties
router.get("/game/difficulties", (_, res)=> {
  res.send((difficulties))
})


//sends list of possible difficulties
router.get("/game/width_height", (_, res)=> {
  res.send(({width: BOARD_WIDTH_BLOCKS, height: BOARD_HEIGHT_BLOCKS}));
})

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
  newGame.save().then((newGame) => {
    res.send({
      status: "success",
      game_id: req.body.game_id,
    });
  }).catch((err) => {
    console.log("ERROR");
    console.log(err);
    res.status(400).send({status: "error", msg: `${err}`})
  });
});

//sends username
router.get("/user/name", (req, res) => {
  User.find({ _id: req.body.user_id }).then((user) => {
    console.log("I GIVE U MY NAME")
    res.send(user.name)
  })
})

router.post("/user/leave", (req, res) => {
  const filter = { _id: req.body.user_id };
  const update = { game_id: null };
  User.findOneAndUpdate(
    filter, 
    update, {
    new: true}
  ).then((res) => {
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
  }).catch((err) => {
    console.log("Error with user/leave");
    console.log(err);
  });

  Game.findOne(filter2, 
    function (err, game) {
      console.log(game);
      game.guesser = (game.guesser && game.guesser._id == req.body.user_id) ? null : game.guesser;
      game.save(function (err) {
          if(err) {
              console.error('ERROR!');
          }
      });
    }
  ).then((res) => {
    socketManager.getIo().emit("players_and_game_id", 
          {
            players: res.players, 
            game_id: res._id,
          });
    console.log("I EMMITED CHANGED PLYERS " + res);
  }).catch((err) => {
    console.log("Error with user/leave");
    console.log(err);
  });
});

router.post("/game/endTurn", (req, res) => {
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    // loop back if last player has gone already
    if (game.turn < game.players.length - 1) {
      game.turn += 1; 
    }
    return game.save().then((updatedGame) => { //updates game document and then shouts the change
      socketManager.getIo().emit("endedTurn", 
      {
        turn: updatedGame.turn, 
        players: updatedGame.players, 
        game_id: updatedGame._id,
      });
      let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
      res.send(game);
    })
  })
  
});

//change text overlay, shouts to people
router.post("/game/onQuit", (req, res)=>{
  Game.findOne({ _id: req.body.game_id })
  .then((game)=> {
    game.num_incorrect += 1;
    game.word_statuses.push("incorrect");
    game.save();
    socketManager.getIo().emit("textOverlay", {
      game_id: req.body.game_id,
      textOverlay: req.body.textOverlay,
      theWordWas: "the word was: " + game.word,
      word: game.word
    })
    console.log("GAME WORD " + game.word)
  })
  
})

router.get("/user/images", (req, res) => {
  User.findOne({_id: req.query.user_id}).then((user) => {
    console.log(user);
    if (!user) {
      res.status(404).send({msg: "user not found"});
      return;
    };

    res.send({
      user_name: user.name,
      correct: user.correct_imgs,
      incorrect: user.incorrect_imgs,
    });
  })
})

//updates game with next word in list
//TODO: if no other word left in list, don't do this?? => end game
//TODO: make nextWord random using Logic.getNextWord()
router.post("/game/nextRound", (req, res) => {
  // Update all users with the image
  
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    console.log(game.word);
    // for async idk
    let word = game.word;
    let status = game.word_statuses[game.word_statuses.length - 1];

    for (let i = 0; i < game.players.length; i++) {
      User.findOne({
        _id: game.players[i]._id
      }).then((user) => {
        let board = game.board;
        if (status == "correct") {
          user.correct_imgs.push({
            pixels: board.pixels,
            width: board.width,
            height: board.height,
            num_filled: board.num_filled,
            title: word,
          });
        } else if (status == "incorrect") {
          user.incorrect_imgs.push({
            pixels: board.pixels,
            width: board.width,
            height: board.height,
            num_filled: board.num_filled,
            title: word,
          });
        }
        user.save();
      })
    }

    // get the next word
    game.word_idx += 1;
    //if the (# of players) words have been played, round ended
    if ((game.word_idx) % game.players.length == 0){
      game.round +=1
    }
    // END GAME
    if (game.word_idx >= game.maxSessions * game.players.length) {
      game.finished = true;
      let score = Logic.getScore(game);
      socketManager.getIo().emit("endGame", {
        game_id: req.body.game_id,
        score: score,
        num_correct: game.num_correct,
        num_incorrect: game.num_incorrect,
      });

      res.send({
        score: score,
        num_correct: game.num_correct,
        num_incorrect: game.num_incorrect,
        status: "end",
      });
      return;
    }

    // Not end game
    game.word = game.words[game.word_idx]; 

    //rotates players
    game.players = Logic.rotatePlayers(game.players) 
    game.guesser = game.players[0];
    game.pixelers = game.players.slice(1,game.players.length);
    game.turn = 0; //resets game, people restart
    game.guesses=[];

    game.save().then((updatedGame) => { //updates game document and then shouts the change

      //if you're on this new word is your last word
      //this is to change the button for "next word" --> "end game" or something
      let almostEnd = false;
      if (updatedGame.word_idx == updatedGame.maxSessions * updatedGame.players.length - 1) {
        almostEnd = true;
      }
      socketManager.getIo().emit("nextWord", 
      {
        game: updatedGame,
        game_id: updatedGame._id,
        turn: updatedGame.turn,
        players: updatedGame.players,
        pixelers: updatedGame.pixelers,
        guesser: updatedGame.guesser,
        round: updatedGame.round,
        status: "not end",
        almostEnd: almostEnd
      });
      let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
      res.send(game);
    })
  })
});

router.get("/user/get", (req, res) => {
  console.log(req.query);
  
  User.find({ _id: req.query.user_id }).then((users) => {
    res.send(users);
  });
});

router.get("/game/get", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((games) => {
    let userValidated = Logic.validateUser(games[0], req.query.user_id);
    if (userValidated && games.length > 0) {
      let game = Logic.getReturnableGame(games[0], req.query.user_id);
      res.send(game);
    } else {
      res.send({status: "error"});
    }
  });
});


router.get("/game/turn", (req, res) => {
  Game.find({ _id: req.query.game_id }).then((games) => {
    let userValidated = Logic.validateUser(games[0], req.query.user_id);
    if (userValidated && games.length > 0) {
      res.send({
        turn: games[0].turn,
        numPlayers: games[0].players.length,
      });
    } else {
      res.send({status: "error"});
    }
  });
});
router.get("/game/players", (req, res) => {
  Game.findOne({ _id: req.query.game_id }).then((game) => {
    let userIdPassed = req.query.user_id;
    if (!userIdPassed) {
      return res.status(400).send({msg: "please pass your user_id"});
    }
    let gameFound = game;
    if (!gameFound) {
      return res.status(400).send({msg: "invalid game ID"});
    }
    let userValidated = Logic.validateUser(game, req.query.user_id);
    if (!userValidated) {
      return res.status(404).send({msg: "invalid user ID"});
    }
    if (userIdPassed && gameFound && userValidated) {
      return res.status(200).send({
        status: 200,
        players: game.players,
        host_id: game.host_id,
        started: game.started,
        msg: "success",
      });
    } 
  });
});


router.get("/game/player_status", (req, res) => {
  console.log("player status...");
  console.log(req.query);
  User.find({_id: req.query.user_id}).then((users) => {
    if (users.length == 0 || !users[0].game_id) {
      res.send({status:"not in game"});
      return;
    } 
    Game.find({ _id: users[0].game_id 
    }).then((games) => {
      console.log("found games:");
      console.log(games);
      if (games.length == 0) {
        res.send({status:"not in game"});
        return;
      } 
      console.log(`USER: ${req.query.user_id}`);
      if (games[0].guesser && games[0].guesser._id == req.query.user_id) {
        res.send({ game_id: games[0]._id, status: "guesser" });
        return;
      } 

      for (let i = 0; i < games[0].players.length; i++) {
        if (games[0].players[i]._id == req.query.user_id) {
          res.send({ game_id: games[0]._id, status: "pixeler" });
          return;
        }
      }
      res.send({status:"not in game"});
    }).catch((err) => {
      console.log(err);
    });
  })


});

router.get("/game/canvas", (req, res) => {
  Game.findOne({ _id: req.query.game_id }).then((game) => {
    let userValidated = Logic.validateUser(game, req.query.user_id);
    if (!userValidated) {
      return res.status(404).send({msg: "invalid user ID"});
    }
    res.send(game.board);
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
  Game.findOne(
    {_id: req.body.game_id}, 
    function (err, game) {
      // if player not already in game
      if (game && game.players) {
        let playerNotInGameYet = true;
        for (let i = 0; i < game.players.length; i++) {
          if (game.players[i]._id == req.body.user_id) {
            playerNotInGameYet = false;
            break;
          }
        }
        if (playerNotInGameYet) {
          game.players = game.players.concat([{
            _id: req.body.user_id, 
            name: req.body.user_name,
            game_id: req.body.game_id,
          }]);
        }
      
        game.save().then((res) => {
          socketManager.getIo().emit("players_and_game_id", 
          {
            players: res.players, 
            game_id: res._id
          });

        }).catch((err) => {console.log(err)});
      }
    },
    ).then(()=>{res.send({status:"success"})})
  .catch((err) => {
    console.log(err);
  });
 
});

router.put("/game/guess", (req, res) => {
  console.log(req.body);
  Game.find({ _id: req.body.game_id })
  .then((games) => {
    const noGamesFound = games.length == 0;
    const emptyGuess = req.body.guess.length == 0;
    const invalidUser = req.body.user_id != games[0].guesser._id;
    
    if (noGamesFound || emptyGuess || invalidUser ) {
      res.status(400).send({ msg: "you are not allowed to guess here" });
    }
    Game.findOne(
      {_id: req.body.game_id},
      function (err, game) {
        let invalidGame = !game || !game.guesses;
        if (invalidGame) {
          return res.status(404).res.send({message: "invalid game"});
        }
        let correct = req.body.guess == game.word;
        game.guesses = game.guesses.concat([req.body.guess]);
        if (correct) {
          game.num_correct += 1;
          game.word_statuses.push("correct");
        }

        game.save().then((updatedGame) => {
          if (correct) {
            res.send({message: "correct"});
            socketManager.getIo().emit("correct_guess", {
              game_id: updatedGame._id,
              theWordWas: "the word was: "+updatedGame.word,
              word: updatedGame.word
            });
          } else {
            res.send({message: "incorrect"});
          }
          socketManager.getIo().emit("guesses", 
          {
            guesses: updatedGame.guesses,
            game_id: updatedGame._id
          });
        });
          

      });
  }).catch((err) => {
    console.log(err);
  })
});

//tells lobby.js the new changed wordpack
router.post("/game/changedWordPack", (req, res)=> {
  socketManager.getIo().emit("changedWordPack", {
    game_id: req.body.game_id,
    wordPack: req.body.wordPack
  })
});

//tells lobby.js the new number of sessions
router.post("/game/changedSessions", (req, res)=> {
  socketManager.getIo().emit("changedSessions", {
    game_id: req.body.game_id,
    sessions: req.body.sessions
  })
});

//tells lobby.js the new difficulty
router.post("/game/changedDifficulty", (req, res)=> {
  socketManager.getIo().emit("changedDifficulty", {
    game_id: req.body.game_id,
    pixel_proportion: req.body.pixel_proportion
  });
});

router.put("/game/start", (req, res) => {
  Game.findOne(
    {_id: req.body.game_id},
    function(err, game) {
      console.log("my start api " + game);
      game.guesser = game.players[0];
      game.pixelers = game.players.slice(1,game.players.length);
      game.started = true;
      game.wordPack = req.body.wordPack;
      game.words = Logic.shuffle(wordPacks[game.wordPack]); //TODO: Logic.shuffle()
      game.word = game.words[0];
      game.word_length = game.word.length;
      game.maxSessions = req.body.sessions;
      game.pixel_limit = req.body.pixel_limit;
      console.log("game.words"+ game.words)
      game.save()
      .then((updatedGame) => {
        //TODO: (philena) change this to socket room for higher efficiency!!!!
        //tells everyone that game started!
        socketManager.getIo().emit("game_id_started", req.body.game_id);
        res.send({status: "success"});
      }).catch((err) => {
        console.log(err);
        res.send({status: `error: ${err}`});
      });
    });
});

router.put("/game/pixel", (req, res) => {
  Game.findOne({_id: req.body.game_id},
    function(err, game) {
      if (game.pixel_limit <= req.body.num_filled) {
        res.send({status: "error", msg: "exceeded limit"});
        return;
      }
    });

  console.log(req.body);
  let color =  req.body.pixel_filled ? req.body.pixel_color: "none";
  //this was helpful: https://stackoverflow.com/questions/56527121/findoneandupdate-nested-object-in-array/56527476
  Game.findOneAndUpdate(
    {
      "_id": req.body.game_id,
    "board.pixels.id": req.body.pixel_id },
    { $set: {
      num_filled: req.body.num_filled,
      "board.pixels.$.color" : color,
      "board.pixels.$.filled": req.body.pixel_filled
      }
    }
  ).then((updatedGame) => {
    console.log("new pixel color " + req.body.pixel_color);
    socketManager.getIo().emit("board_and_game_id", 
    {
      pixel_id: req.body.pixel_id,
      pixel_id_filled: req.body.pixel_filled,
      pixel_color: req.body.pixel_color,
      board: updatedGame.board,
      game_id: updatedGame._id,
    });
    let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
    res.send(game);
  });
});
      
router.post("/board/clear_pixels", (req, res) => {
  console.log(req.body);
  Game.findOne({_id: req.body.game_id},
    function(err, game) {
      if (!game || !game.board) {
        res.status(400).send({ msg: "game not found" });
        return;
      }
      console.log(game);
      // if (game && game.board) {
      game.board.num_filled = 0;
      for (let i = 0; i < game.board.pixels.length; i++) {
        game.board.pixels[i].color = "none";
        game.board.pixels[i].filled = false;
      }
      game.save().then((res) => {
        console.log("BACKEND CLEARING WORKS")
        console.log("THIS IS THE GAME " + game)
        socketManager.getIo().emit("cleared_canvas", 
          {
            board: res.board, 
            pixels: res.board.pixels, 
            _id: res._id, 
          });
      });
    }
  ).then((updatedGame) => {
    socketManager.getIo().emit("cleared_canvas", 
    {
      board: updatedGame.board, 
      _id: updatedGame._id, 
    });
    res.send({board: updatedGame.board});
  }).catch((err) => {
    console.log(err);
  });
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
