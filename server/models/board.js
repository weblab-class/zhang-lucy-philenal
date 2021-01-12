const mongoose = require("mongoose");

//define a comment schema for the database
const PixelSchema = new mongoose.Schema({
  color: String,
  filled: Boolean,
});

const BoardSchema  = new mongoose.Schema({
    _id: String,
    width: Number,
    height: Number,
    pixels: [{
        type: PixelSchema,
    }],
})

// compile model from schema
module.exports = mongoose.model("board", BoardSchema);