const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // colony: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'colony'
    // }],
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
