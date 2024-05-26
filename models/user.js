const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");

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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
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
    resetPasswordFlag: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  catchAsyncError(async () => {
    if (!this.isModified("password")) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
  })(next);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  console.log(enteredPassword, this.password);
  return bcrypt.compareSync(enteredPassword, this.password);
};

userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id, username: this.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("user", userSchema);
