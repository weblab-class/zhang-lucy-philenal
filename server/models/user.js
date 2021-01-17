const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  _id: String,
  game_id: String,
  googleid: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
