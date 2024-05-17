var express = require("express");
var router = express.Router();
const {
  registerController,
  logoutUser,
} = require("../controllers/userController");
const passport = require("passport");

/* GET home page. */
router.post("/register", registerController);

router.post("/login", (req, res, next) => {
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
      return res.send("Logged in successfully");
    });
  })(req, res, next);
});

router.post("/logout", logoutUser);

module.exports = router;
