const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  _id: String,
  game_id: String,
  guessed_imgs: [String], // board id's  
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
