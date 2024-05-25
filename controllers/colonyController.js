const colonyModel = require("../models/colony");
const userModel = require("../models/user");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const { Collection } = require("mongoose");

const colonyCreator = catchAsyncError(async (req, res, next) => {
  const { colonyName, nativeToken, nativeTokenSymbol } = req.body;
  const newColony = new colonyModel({
    colonyName,
    nativeToken,
    nativeTokenSymbol,
    creatorId: req.id,
    rootUsers: [req.id],
    contributors: [req.id],
  });
  newColony.save();

  const user = await userModel.findById(req.id);
  user.colonies.push(newColony._id);
  user.tokens.push({
    token: newColony.nativeToken,
    symbol: nativeTokenSymbol,
    colony: newColony._id,
  });
  user.save();

  res.status(201).json({ newColony, user });
});

const joinColony = catchAsyncError(async (req, res, next) => {
  const { colonyId } = req.body;
  const colony = await colonyModel.findById(colonyId);
  if (!colony) {
    return next(new ErrorHandler("Colony Not Found", 404));
  }
  const user = await userModel.findById(req.id);
  user.colonies.push(colonyId);
  user.tokens.push({
    token: colony.nativeToken,
    symbol: colony.nativeTokenSymbol,
    colony: colonyId,
  });

  colony.watchers.push(req.id);

  await user.save();
  await colony.save();
  res
    .status(200)
    .json({ status: true, message: "Joined Colony", user, colony });
});

module.exports = { colonyCreator };
