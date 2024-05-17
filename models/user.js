const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

require("../db");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
    },
    tokens: [
      {
        token: {
          type: String,
          default: null,
        },
      },
    ],
    colony: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colony",
        default: null,
      },
    ],
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
  },
  { timestamps: true }
);

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
