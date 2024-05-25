const userModel = require("../models/user");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const { sendToken } = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const { sendEmail } = require("../utils/mailer");

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

const logoutController = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "logged out" });
});


const forgetPasswordController = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const url = req.protocol + "://" + req.get("host") + "/user/reset-password/v2/" + user._id;

  sendEmail(user.email, url, next, res);

});

const resetPasswordController = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    message: "Password Updated Successfully",
  });
});

module.exports = { registerController, forgetPasswordController, loginController, logoutController, resetPasswordController };