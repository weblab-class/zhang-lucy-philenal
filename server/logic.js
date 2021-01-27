// OH question: how to make this work with multiple games 
//if there's only one gameState that is populating all users whose sockets have connected?

// OH: how does logic.js work overall??
const Game = require("./models/game");

// wow incredible how RFC
const BOARD_WIDTH_BLOCKS = 20;
const BOARD_HEIGHT_BLOCKS = 20;

// hardcoded wordpacks
const wordpacks = {
  "basic (easy)": ["car", "pencil", "pizza", "rainbow", "sun", "recycle", "book", "baby", "pig", "butterfly", "banana", "sleep", "apple", "orange", "cake", "mug", "dog", "tree", "spider", "bee", "eye", "wig", "beard", "rain", "door", "leaf", "taxi", "teeth", "ear", "face", "foot", "hand", "mask", "backpack", "castle", "makeup", "phone", "computer", "fork", "spoon", "chair", "hat", "coat", "scarf", "shoes", "socks", "plate", "bike", "car", "bus", "bottle", "tv", "brush", "zoom", "fan", "skirt", "math", "iron", "lamp", "biology", "mailbox", "bridge", "building", "grill", "chess", "camping", "balloon", "clown", "necklace", "clock", "mirror", "eraser", "camera"],

  "food (easy)": ["burger", "fries", "taco", "egg", "corn", "lemon", "tofu", "sushi", "tomato", "potato", "cherry", "pasta", "apple", "grapes", "pear", "candy", "banana", "carrot", "onion", "bread", "cheese", "butter", "popcorn", "chips", "cookie", "cake", "nuts", "pepper", "ribs", "steak", "chicken", "fish", "shrimp", "crab", "kiwi", "avocado", "boba", "tea", "mushroom", "sandwich", "salad", "dumpling", "ham", "milk", "lemonade", "donut", "bacon", "hotdog", "waffle", "pancake", "muffin", "cereal"],

  "nature (easy)": ["mountain", "river", "lake", "sun", "grass", "tree", "flower", "star", "moon", "cloud", "wind", "earth", "valley", "snow", "rain", "volcano", "desert", "forest", "rainbow", "tornado", "tsunami", "beach", "rock", "branch", "dirt", "acorn", "leaf", "seed", "fire", "cave", "cliff"],

  "animal (medium)": ["pig", "sheep", "bird", "dog", "cat", "cow", "horse", "chicken", "rat", "spider", "ant", "duck", "raccoon", "rabbit", "bee", "frog", "snake", "fish", "dolphin", "shark", "crab", "penguin", "seal", "bear", "wolf", "lion", "squirrel", "elephant", "camel", "dragon", "flamingo", "monkey", "giraffe", "peacock", "crane", "hippo", "dinosaur", "koala", "kangaroo", "sloth", "turtle", "panda", "moose", "swan", "starfish", "clam", "octopus", "seahorse", "unicorn", "snail", "pigeon", "eagle", "owl", "seagull", "turkey", "ladybug", "zebra", "cheetah", "gorilla"],

  "expressions (medium)": ["happy", "sad", "mad", "annoyed", "angry", "confused", "scared", "shy", "jealous", "sleepy", "sick", "loving", "stressed", "neutral", "hurt", "silly", "smirk", "dizzy", "crazy"],
  
  "soft (medium)": ["pony", "rainbow", "friends", "love", "flower", "cat", "dog", "bunny", "cloud", "boba", "dream", "polaroid", "smile"],

  "characters (hard)":["simpson", "arthur", "barnie", "elmo", "shrek", "bob", "saitama", "gon", "pikachu", "dora", "barbie", "rapunzel", "genie", "hinata",  "superman", "ironman", "flash", "batman", "snoopy", "mickey", "jerry", "tweety", "ferb", "elsa", "scooby", "winnie", "ariel", "popeye", "simba", "goofy", "doraemon", "totoro", "naruto", "aang", "pororo"],

  "mit (hard)": ["tim", "hose", "urop", "dance", "weblab", "borderline", "poker", "sing", "flour", "boston", "ocw", "dome", "ramen", "rowing", "spark", "banana", "simmons"],

  "jank (extreme)": [ "whip", "vibe", "bop", "jank", "stan", "bruh", "shook", "dab", "woah", "yeet", "dank", "dawg", "yolo", "boomer", "fetch", "goat", "gucci", "salty", "tea", "slaps", "bet", "fleek", "clout", "wig", "lit", "simp", "cap", "fam", "karen", "snatched", "extra", "basic", "ship", "vsco", "poggers", "noob", "flex", "bread"],
};

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
  const output = [array[array.length-1]];
  
  for ( let i = 0; i < array.length - 1; i++) {
    output.push(array[i]);
  }

  return output;
}

// Called by newgame POST
const newGame = (req) => {
  const newPixels = [];
  const numPixels = BOARD_WIDTH_BLOCKS * BOARD_HEIGHT_BLOCKS;

  for (let i = 0; i < numPixels; i++) {
    newPixels.push({key: i, id: i, color: "none", filled: false});
  }

  const newBoard = {
    width: BOARD_WIDTH_BLOCKS,
    height: BOARD_HEIGHT_BLOCKS,
    pixels: newPixels,
  };

  let wordpackName = "basic (easy)";
  let wordpack = shuffle(wordpacks[wordpackName]);

  const newGame = new Game({
    _id: req.body.game_id,
    host_id: req.body.user_id,
    players: [{
      name: req.body.user_name, 
      _id: req.body.user_id
    }],
    pixelers: [{
      name: req.body.user_name, 
      _id: req.body.user_id
    }],
    board: newBoard,
    started: false,
    finished: false,
    maxSessions: 1,
    session: 0,
    round: 1,
    turn: 0,
    wordpack: wordpackName,
    word: wordpack[0],
    word_statuses: [],
    word_idx: 0,
    words: wordpack,
    guesses: [],
    guesser: null,
    num_correct: 0,
    num_incorrect: 0,
    num_filled: [],
    pixel_limit: undefined,
  });

  return newGame;
}

// only draw a word that hasn't been drawn yet
const getNextWord = (gameSchema) => {
  return words[word_idx];
}

// Returns true if user is in the game, false otherwise
const validateUser = (game, user_id) => {
  if (!game || !game.players) {
    return false;
  }
  
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i]._id == user_id) {
      return true;
    }
  }
  return false;
}

const validatePixeler = (game, user_id) => {
  if (!game || !game.players || !game.pixelers) {
    return false;
  }

  let ok = false;
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i]._id == user_id) {
      ok = true;
    }
  }
  if (!ok) return false;

  for (let i = 0; i < game.pixelers.length; i++) {
    if (game.pixelers[i]._id == user_id) {
      return true;
    }
  }
  return false;
}

// Called by /game/new, /game/get, any API that needs to hide
// certain fields
// Fields to hide: words, word.
const getReturnableGame = (game, user_id) => {
  if (game && game.word && game.pixelers && game.words) {
    // always hide the word list
    game.words = null;
    game.word_idx = null;
    
    if (game.pixelers) {
      // if the user is pixeler, don't hide word
      for (let i = 0; i < game.pixelers.length; i++) {
        if (game.pixelers[i]._id == user_id) {
          return game;
        }
      }

      // otherwise hide the word
      if (game.word) {
        let hiddenWord = "";
        for (let i = 0; i < game.word.length; i++){
          hiddenWord += "_ ";
        }
        game.word = hiddenWord; 
      }

      return game;
    } else {
      game.word = null;
      game.words = null;
      game.word_idx = null;
    }

  }
  return null;
}

const updatePixel = (game, pixel_id, color, pixel_filled) => {
  let originalPixel = game.board.pixels[pixel_id];
  game.board.pixels[pixel_id] = {
    color: color,
    filled: pixel_filled,
    id: originalPixel.id,
    key: originalPixel.key,
  };
  return game;

}

// Called AFTER startGame
// 1. determine ordering of guessers/pixelers
// go in chronological order for now
// 2. determine words
const initializeGame = (game) => {
  // game.players = shuffle(game.players);

  // game.guesser = game.players[0];
  // game.pixelers = game.players.slice(1,game.players.length);

  // game.num_filled = [];
  // for (let i = 0; i < game.players.length; i++) {
  //   game.num_filled.push({
  //     user_id: game.players[i]._id,
  //     count: 0,
  //   })
  // }

  // game.words = shuffle(game.words);
  // game.word = game.words[0];
  // game.started = true;
  // return game;
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

const getScore = (game) => {
  return Math.round(100 * (game.num_correct / (game.num_incorrect + game.num_correct)));
}

/* constants here */

/* game state */
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
    wordpacks,
    newGame,
    // initializeGame,
    getNextWord,
    gameState,
    addPlayer,
    removePlayer,
    rotatePlayers,
    getReturnableGame,
    validateUser,
    validatePixeler,
    shuffle,
    getScore,
    updatePixel,
  };