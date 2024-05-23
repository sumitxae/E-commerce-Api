const colonyModel = require("../models/colony");
const userModel = require("../models/user");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");

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
  user.tokens.push({ token: newColony.nativeToken, symbol: nativeTokenSymbol, colony: newColony._id });
  user.save();

  res.status(201).json({ newColony, user });
});

module.exports = { colonyCreator };
