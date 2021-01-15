//question: how to make this work with multiple games 
//if there's only one gameState that is populating all users whose sockets have connected?

//how does logic.js work overall??

/* utils here */
const getRandomOrder = () => { //playersId should be object of (info of user) playing game
    //makes a new array of players with {_id, playerInfo: }
    const players = [];
    Object.keys(gameState.playersId).forEach(key=> players.push({
      _id: key,
      playerInfo: gameState.playersId[key]
    }))

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

//updates turn 
const changeTurn = () => {
    gameState.players[gameState.turn].isMyTurn = false;
    gameState.turn +=1;
    gameState.players[gameState.turn].isMyTurn = true;

}

/* constants here */

/* game state */
const gameState = {
    //fill me in -- not sure whether to key players with id or order
    
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
    gameState.playersId[id].color = getPlayerColor(id);
    gameState.playersId[id].isGuesser = false;
    gameState.playersId[id].order = null;
    gameState.playersId[id].isMyTurn = false;
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