// OH question: how to make this work with multiple games 
//if there's only one gameState that is populating all users whose sockets have connected?

// OH: how does logic.js work overall??
const Game = require("./models/game");

// wow incredible how RFC
const BOARD_WIDTH_BLOCKS = 3;
const BOARD_HEIGHT_BLOCKS = 3;

// hardcoded wordpacks
const wordPacks = {"default": ["car", "pencil", "pizza", "rainbow", "sun", "recycle", "book", "baby"]};

/* utils here */
const getRandomOrder = () => { //playersId should be object of (info of user) playing game
    
    let players = playersIdToPlayersList();
    // uses the good ole fisher yates theorem to make sure you get random permutation of order (modifies players)
    let i;
    for(i = players.length-1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = players[i];
      players[i] = players[j];
      players[j] = temp;
    }
    //sets the last player in order to be the guesser
    players[players.length-1].playerInfo.isGuesser = false;
    //sets players in the gameState to the new, ordered players list
    gameState.players = players
  };


// Credits: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const rotatePlayers = (array) => {
  const first = array[0];
  for (let i=0; i < array.length-1; i++){ //rotates by shifting order up (4 --> 3)
    array[i] = array[(i+1)%array.length]
  }
  array[array.length-1] = first;

  return array
}

// Called by newgame POST
const newGame = (req) => {
  const newPixels = [];
  const numPixels = BOARD_WIDTH_BLOCKS * BOARD_HEIGHT_BLOCKS;

  for (let i = 0; i < numPixels; i++) {
    newPixels.push({key: i, id: i, color: "none", filled: false});
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
    players: [{
      name: req.body.user_name, 
      _id: req.body.user_id
    }],
    board: newBoard,
    started: false,
    finished: false,
    round: null,
    turn: null,
    wordpack: "default",
    word: wordPacks["default"][0],
    word_length: wordPacks["default"][0].length,
    word_idx: 0,
    words: wordPacks["default"],
    guesses: [],
    guesser: null,
  });

  return newGame;
}

//TODO: make this random!!
// only draw a word that hasn't been drawn yet
const getNextWord = (gameSchema) => {
  return words[word_idx];
}

// Called AFTER startGame
// 1. determine ordering of guessers/pixelers
// go in chronological order for now
// 2. determine words
const initializeGame = (game) => {
  // TODO: comment in when we care
  // game.players = shuffle(game.players);
  game.guesser = game.players[0];
  game.pixelers = game.players.slice(1,game.players.length);
  return game;
}



const playersIdToPlayersList = () => {
  //makes a new array of players with {_id, playerInfo: }
  const players = [];
  Object.keys(gameState.playersId).forEach(key=> players.push({
    _id: key,
    playerInfo: gameState.playersId[key]
  }))
  return players;
}

//updates turn 
const changeTurn = () => {
  // prev
  gameState.players[gameState.turn].isMyTurn = false;
  gameState.turn +=1;
  gameState.players[gameState.turn].isMyTurn = true;

}

/* constants here */

/* game state */
// TODO: I think game state should be the same as GameSchema? -lz
// OH
const gameState = {
    //fill me in -- not sure whether to key players with id or order
   /*  games: {}, //object of game objects */
    winner: false, //if guesser correctly guessed --> team won
    players: [], // based off of order
    // order -> {  //what turn you're supposed to go on
    //     color: icon color/design, 
    //     isGuesser: Boolean,
    //     id: Number
    //     isMyTurn: Boolean
    // }
    playersId: {}, //based off of playerid
    // id -> {  //what turn you're supposed to go on
    //     color: icon color/design, 
    //     isGuesser: Boolean,
    //     isMyTurn: Boolean
    // }
    turn: 1, //what turn you're currently on
    board: {}, //the board/canvas of game

}

/** game logic */

//TODO: should game state include canvas board??
/* updates canvas board --> */


/** Adds a player to the game state, initialized*/
const addPlayer = (id) => {
    // gameState.playersId[id].color = getPlayerColor(id);
    // gameState.playersId[id].isGuesser = false;
    // gameState.playersId[id].order = null;
    // gameState.playersId[id].isMyTurn = false;
  };

/** Remove a player from the game state if they DC */
const removePlayer = (id) => {
    delete gameState.players[id];
  };


module.exports = {
    newGame,
    initializeGame,
    getNextWord,
    gameState,
    addPlayer,
    removePlayer,
    rotatePlayers
  };