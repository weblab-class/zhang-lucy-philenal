const mongoose = require("mongoose");

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
    color: String,
    filled: Boolean,
    id: Number,
    key: Number,
  }],
  title: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  _id: String,
  game_id: String,
  guessed_imgs: [BoardSchema], // board id's  
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
