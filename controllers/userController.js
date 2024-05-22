const userModel = require("../models/user");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const { sendToken } = require("../utils/sendToken");

passport.use(new localStrategy(userModel.authenticate()));

const registerController = catchAsyncError((req, res, next) => {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel
    .register(newUser, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        sendToken(req.user, 200, res);
      });
    })
    .catch((err) => {
      return next(err);
    });
});

const loginController = catchAsyncError(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      sendToken(user, 200, res);
    });
  })(req, res, next);
});

const logoutUser = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "logged out" });
});

module.exports = { registerController, logoutUser, loginController };

// req.logout(function (err) {
//   if (err) {
//     return next(err);
//   }
