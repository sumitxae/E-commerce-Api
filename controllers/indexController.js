const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/user");

const homePageController = (req, res, next) => {
  res.send("Secured Route");
};

const sessionController = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.id);
  res.json(user);
});

module.exports = { homePageController, sessionController };