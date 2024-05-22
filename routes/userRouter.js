var express = require("express");
var router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/loggerMiddleware");

const {
  registerController,
  logoutUser,
  loginController
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authoriser");

/* GET home page. */
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", isAuthenticated, logoutUser);

module.exports = router;
