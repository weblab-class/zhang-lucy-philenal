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
      type: PixelSchema,
  }],
});

// compile model from schema
module.exports = mongoose.model("board", BoardSchema);