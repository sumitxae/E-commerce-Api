var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const passport = require("passport");
const {
  registerController,
  loginController,
  logoutUser,
} = require("../controllers/userController");

/* GET home page. */
router.post("/register", registerController);

router.post("/login", loginController);

router.get('/logout', logoutUser);

module.exports = router;
