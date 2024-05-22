const userModel = require("../models/user");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { catchAsyncError } = require('../middlewares/catchAsyncErrors');

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
        res.json(req.user);
      });
    })
    .catch((err) => {
      return next(err);
    });
});

const loginController =  (req, res, next) => {
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
      return res.status(201).json(req.user);
    });
  })(req, res, next);
}

const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("logged out");
  });
};

module.exports = { registerController, logoutUser, loginController };
