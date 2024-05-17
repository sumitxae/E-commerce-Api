const userModel = require("../models/user");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(userModel.authenticate()));

const registerController = async (req, res) => {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel
    .register(newUser, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.send("registered");
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("logged out");
  });
};

module.exports = { registerController, logoutUser };
