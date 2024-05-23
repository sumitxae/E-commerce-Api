const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  colony: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "colony",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

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
    tokens: {
      type: [tokenSchema],
      default: [],
    },
    colonies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colony",
        default: [],
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

userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("user", userSchema);
