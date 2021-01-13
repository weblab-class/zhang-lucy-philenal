/* utils here */
const getRandomGuesser = (users) => { //users should be object of user objects playing game
    
  };

const changeTurn = () => {
    gameState.players[gameState.turn].isMyTurn = false;
    gameState.turn +=1;
    gameState.players[gameState.turn].isMyTurn = true;

}

/* constants here */

/* game state */
const gameState = {
    //fill me in -- not sure whether to key players with id or order
    
    win: false, //if guesser correctly guessed --> team won
    players: {}, // based off of order
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
    //     order: Number
    //     isMyTurn: Boolean
    // }
    turn: 1, //what turn you're currently on

}

/** game logic */

/** Adds a player to the game state, initialized*/
const addPlayer = (id) => {
    gameState.players[id].color = getPlayerColor(id);
    gameState.players[id].isGuesser = false;
    gameState.players[id].order = null;
    gameState.players[id].isMyTurn = false;
  };

/** Remove a player from the game state if they DC */
const removePlayer = (id) => {
    delete gameState.players[id];
  };


module.exports = {
    gameState,
    addPlayer,
    removePlayer,
  };