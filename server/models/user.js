const mongoose = require("mongoose");

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
  googleid: String,
  game_id: String,
  correct_imgs: [BoardSchema],
  incorrect_imgs: [BoardSchema],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
