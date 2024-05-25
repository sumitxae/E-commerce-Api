var express = require("express");
var router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/loggerMiddleware");

const {
  registerController,
  logoutController,
  loginController,
  forgetPasswordController,
  resetPasswordController
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authoriser");

/* GET home page. */
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", isAuthenticated, logoutController);

router.post('/forget-password', forgetPasswordController);

router.post("/reset-password/:id", resetPasswordController);

module.exports = router;
