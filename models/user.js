const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

require('../db');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    // colony: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'colony'
    // }],
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
