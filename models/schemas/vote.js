const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  stake: { type: Number, required: true },
  vote: { type: String, enum: ["In Favor", "Against"], required: true },
});

module.exports = voteSchema
