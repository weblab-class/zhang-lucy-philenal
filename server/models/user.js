const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  game_id: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
