var express = require("express");
var router = express.Router();
const passport = require("passport");

const {
  registerController,
  logoutUser,
  loginController
} = require("../controllers/userController");

/* GET home page. */
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutUser);

module.exports = router;
