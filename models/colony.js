const mongoose = require("mongoose");

const colonySchema = new mongoose.Schema({
  colonyName: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  rootUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
  ],
});

module.exports = mongoose.model("colony", colonySchema);
