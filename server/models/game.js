
const mongoose = require("mongoose");

// OH

const PixelSchema = new mongoose.Schema({
  color: String,
  filled: Boolean,
  id: Number,
  key: Number,
});

const BoardSchema  = new mongoose.Schema({
  _id: String,
  width: Number,
  height: Number,
  num_filled: Number,
  pixels: [{
      type: PixelSchema,
  }],
});

const UserSchema = new mongoose.Schema({
  name: String,
  _id: String,
  game_id: String,
  correct_imgs: [BoardSchema], // board id's  
  googleid: String,
});

// DNR = Do Not Return 
//define a game schema for the database
const GameSchema = new mongoose.Schema({
  _id: String,
  host_id: String, // DNR? links to the _id of the host user (_id is an autogenerated field by Mongoose).
  players: [UserSchema],
  pixelers: [UserSchema],
  board: BoardSchema,
  started: Boolean,
  finished: Boolean,
  maxSessions: Number,
  session: Number, // default: 1, {#player} rounds within sessions
  round: Number, // {# player} words per round
  turn: Number, // whose turn (0 index), there are {#players-1} turns per word
  //if word_idx == {#players-1}, end of turns for that word
  wordpack: String,
  word: String, //DNR for guesser
  word_idx: Number, //DNR, index of current word
  word_statuses: [String],
  words: [String], //DNR
  guesses: [String],
  guesser: UserSchema,
  num_correct: Number,
  num_incorrect: Number,
  num_filled: Number,
  pixel_limit: Number,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
