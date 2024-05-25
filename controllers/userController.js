const userModel = require("../models/user");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const { sendToken } = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");

const registerController = catchAsyncError(async (req, res, next) => {
  const newUser = await userModel.create(req.body);
  sendToken(newUser, 201, res);
});

const loginController = catchAsyncError(async (req, res, next) => {
  const user = await userModel
    .findOne({ username: req.body.username })
    .select("+password");
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const isPasswordMatch = await user.comparePassword(req.body.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
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
