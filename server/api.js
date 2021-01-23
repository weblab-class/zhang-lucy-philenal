/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

// lol please centralize this
const BOARD_WIDTH_BLOCKS = 2;
const BOARD_HEIGHT_BLOCKS = 2;

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

/**
 * Takes in a list of users, a board, and saves them to the user's
 * wall of fame/shame
 */
router.post("/board/save", (req, res) => {
  res.send({status: "good"});
  // update all users
  // for (let i = 0; i < req.body.user_ids.length; i++) {
  //   const filter = { _id: req.body.user_ids[i] };
  //   User.findOne(filter,
  //     // new: true,
  //     function(err, user) {
  //       if (user.guessed_imgs) {
  //         user.guessed_imgs = user.guessed_imgs.concat([req.body.img_id]);
  //       } else {
  //         user.guessed_imgs = [req.body.img_id];
  //       }
  //   }).then((res)=>{
  //     console.log(res);
  //   });
  // }
  
  // Game.find({ _id: req.body.game_id }).then((games) => {
  //   if (games.length == 0) {
  //     res.status(404).send({ msg: `game not found with id ${req.body.game_id}` });
  //     return;
  //   }
  //   let board = new Board({
  //     _id: games[0].board._id,
  //     width: games[0].board.width,
  //     height: games[0].board.height,
  //     pixels: games[0].board.pixels,
  //   });
  //   // let board = Board(games[0].board);
  //   board.save().then((board) => {res.send(board)});
  // });

});


router.post("/user/leave", (req, res) => {
  console.log("what");
  console.log(req.body);
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
    console.log(res);
  }).catch((err) => {
    console.log("Error with user/leave");
    console.log(err);
  });


});

//TODO: update logic when pixeler ends turn, or pixelsLeft = 0
//
router.post("/game/endTurn", (req, res) => {
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    // loop back if last player has gone already
    if (game.turn < game.players.length - 1) {
      game.turn += 1; //adds turn
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

//updates game with next word in list
//TODO: if no other word left in list, don't do this?? => end game
//TODO: make nextWord random using Logic.getNextWord()
router.post("/game/nextRound", (req, res) => {
  // TODO: if guess was incorrect/quit, overlay should be something sad
  Game.findOne({ _id: req.body.game_id }).then((game) => { //find game
    // get the next word
    game.word_idx += 1;
    game.word = game.words[game.word_idx]; 
    game.wordLength = game.word.length;

    //rotates players
    game.players = Logic.rotatePlayers(game.players) 
    game.guesser = game.players[0];
    game.pixelers = game.players.slice(1,game.players.length);
    game.turn = 0; //resets game, people restart

    //TODO: save the previous game image in game schema
    let newBoard = new Board({
      // _id: game.board._id,
      width: game.board.width,
      height: game.board.height,
      pixels: game.board.pixels,
    });

    /* console.log("BOARD"); */
    /* console.log(newBoard); */
    newBoard.save().then((board) => {
      console.log("THIS IS THE BOARD " + board);
    }).then(()=>game.save()
    ).then((updatedGame) => { //updates game document and then shouts the change
      socketManager.getIo().emit("nextWord", 
      {
        game: updatedGame,
        game_id: updatedGame._id,
        turn: updatedGame.turn,
        players: updatedGame.players,
        pixelers: updatedGame.pixelers,
        guesser: updatedGame.guesser,
      });
      let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
      res.send(game);
    })
  })
});

router.get("/user/get", (req, res) => {
  console.log(req.query);
  
  User.find({ _id: mongoose.Types.ObjectId(req.query.user_id) }).then((users) => {
    res.send(users);
  });
});

// TODO: kill this bad function lol (lucy)
router.get("/game/get", (req, res) => {
  // CHECK THAT THE PERSON IS 1) IN GAME 2) A PIXELER
  Game.find({ _id: req.query.game_id }).then((games) => {
    // TODO: check that the user is in game
    if (req.query.user_id && games.length > 0) {
      let game = Logic.getReturnableGame(games[0], req.query.user_id);
      res.send(game);
    } else {
      res.send([]);
    }
  });
});


router.get("/game/players", (req, res) => {
  // CHECK THAT THE PERSON IS 1) IN GAME 2) A PIXELER
  Game.findOne({ _id: req.query.game_id }).then((game) => {
    // TODO: check that the user is in game
    let userIdPassed = req.query.user_id;
    if (!userIdPassed) {
      res.status(400).send({msg: "please pass yoursr user_id"});
    }
    let gameFound = game;
    if (!gameFound) {
      res.status(400).send({msg: "invalid game ID"});
    }
    let userValidated = Logic.validateUser(game, req.query.user_id);
    if (!userValidated) {
      res.status(404).send({msg: "invalid user ID"});
    }
    if (userIdPassed && gameFound && userValidated) {
      res.status(200).send({
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
  // TODO: Check if the user is in the game
  // console.log("what");
  Game.findOne({ _id: req.query.game_id }).then((game) => {
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
      
        game.save(
        //   function (err) {
        //   if(err) {
        //     console.log(err);
        //       console.error('ERROR!');
        //   }
        // }
        ).then((res) => {
          console.log("HIIIIIIIIIIIIIIIII");
          console.log(res);
          socketManager.getIo().emit("players_and_game_id", 
          {
            players: res.players, 
            game_id: res._id
          });

        }).catch((err) => {console.log(err)});
      }
    },
    ).then(()=>{res.send({status:"success"})})
  //   .then((updatedGame) => {
  //     // TODO: Fix this
  //     console.log("updateds");
  //     console.log(updatedGame);
  //     socketManager.getIo().emit("players_and_game_id", 
  //     {
  //       players: updatedGame.players, 
  //       game_id: updatedGame._id
  //     });
  //     res.send({status: "success"});
  // })
  .catch((err) => {
    console.log(err);
  });
  //TODO: (philena) change this to socket room for higher efficiency!!!!
  //shouts the updated players list + the game id to all connected sockets
 
});

router.put("/game/guess", (req, res) => {
  console.log(req.body);
  Game.find({ _id: req.body.game_id })
  .then((games) => {
    const noGamesFound = games.length == 0;
    const emptyGuess = req.body.guess.length == 0;
    // TODO:  put this back in
    const invalidUser = req.body.user_id != games[0].guesser._id;
    
    if (noGamesFound || emptyGuess || invalidUser ) {
      res.status(400).send({ msg: "you are not allowed to guess here" });
    }
    Game.findOne(
      {_id: req.body.game_id},
      function (err, game) {
        let invalidGame = !game || !game.guesses;
        if (invalidGame) {
          res.status(404).res.send({message: "invalid game"});
        }
        let correct = req.body.guess == game.word;
        game.guesses = game.guesses.concat([req.body.guess]);
        if (correct) {
          game.num_correct += 1;
        }
        // TODO: increment turn/word
        game.save().then((updatedGame) => {
          if (correct) {
            res.send({message: "correct"});
            socketManager.getIo().emit("correct_guess", {
              game_id: updatedGame._id
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
})

router.put("/game/start", (req, res) => {
  Game.findOne(
    {_id: req.body.game_id},
    function(err, game) {
      console.log("my start api " + game);
      game.guesser = game.players[0];
      game.pixelers = game.players.slice(1,game.players.length);
      game.started = true;

      game.save()
      .then((updatedGame) => {
        //TODO: (philena) change this to socket room for higher efficiency!!!!
        //tells everyone that game started!
        console.log("before socket manager start");
        socketManager.getIo().emit("game_id_started", req.body.game_id);
        let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
        res.send(game);
      }).catch((err) => {console.log(err)});
    });
 
  
});

router.post("/game/color", (req, res) => {
  // console.log(typeof req.body.color);
  socketManager.getIo().emit("color", 
          {
            game_id: req.body.game_id,
            background: req.body.color,
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
    console.log("new pixel color " + req.body.pixel_color);
    socketManager.getIo().emit("board_and_game_id", 
    {
      pixel_id: req.body.pixel_id,
      pixel_id_filled: req.body.pixel_id_filled,
      pixel_color: req.body.pixel_color,
      board: updatedGame.board,
      game_id: updatedGame._id
    });
    let game = Logic.getReturnableGame(updatedGame, req.body.user_id);
    res.send(game);
  });

  //shouts the updated pixels + the game id to all connected sockets
  //TODO: change this idk

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
      for (let i = 0; i < BOARD_WIDTH_BLOCKS * BOARD_HEIGHT_BLOCKS; i++) {
        game.board.pixels[i].color = "none";
        game.board.pixels[i].filled = false;
      }
      game.save().then((res) => {
        socketManager.getIo().emit("cleared_canvas", 
          {
            board: res.board, 
            pixels: res.board.pixels, 
            _id: res._id, 
          });
      });
    }
  ).then((updatedGame) => {
    // TODO: Fix this
    // console.log("updated game!!!");
    // console.log(updatedGame);
    socketManager.getIo().emit("cleared_canvas", 
    {
      board: updatedGame.board, 
      // pixels: updatedGame.board.pixels, 
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
