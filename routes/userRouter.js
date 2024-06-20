var express = require("express");
var router = express.Router();

const {
  registerController,
  logoutController,
  loginController,
  forgetPasswordController,
  resetPasswordController
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", isAuthenticated, logoutController);

router.post('/reset-password/v1', forgetPasswordController);

router.post("/reset-password/v2/:id", resetPasswordController);

module.exports = router;
