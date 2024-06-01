const colonyModel = require("../models/colony");
const userModel = require("../models/user");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const decisionModel = require("../models/decision");
const promoterDecision = require("../models/schemas/promotion");
const mintDecision = require("../models/schemas/mintToken");
const paymentDecision = require("../models/schemas/expenditure");
const { createDecisionHandler } = require("../utils/createDecisionHandler");

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
  const colonyId = req.query.colonyId;
  const colony = await colonyModel.findById(colonyId);
  if (!colony) {
    return next(new ErrorHandler("Colony Not Found", 404));
  }
  const user = await userModel.findById(req.id);
  if (user.colonies.includes(colonyId)) {
    return next(
      new ErrorHandler("You are already a member of this colony!", 400)
    );
  }
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

const createDecision = catchAsyncError(async (req, res, next) => {
  const votingPeriod = 1 * 60;
  const votingEndsAt = new Date(Date.now() + votingPeriod);
  const status = null;
  const decisionObject = {
    title: req.body.title,
    description: req.body.description,
    colony: req.body.colonyId,
    creator: req.id,
    votingEndsAt,
  };
  if (req.params.type === "payment") {
    const details = {
      payer: req.body.payer,
      receiver: req.body.receiver,
      amount: req.body.amount,
    };
    status = createDecisionHandler(paymentDecision, decisionObject, details);
  } else if (req.params.type === "promotion") {
    const details = {
      promoted: req.body.promoted,
      promoter: req.body.promoter,
      colony: req.body.colonyId,
    };
    status = createDecisionHandler(promoterDecision, decisionObject, details);
  } else if (req.params.type === "mint") {
    const details = {
      mintedToken: req.body.mintedToken,
      mintee: req.id,
      amount: req.body.amount,
    };
    status = createDecisionHandler(mintDecision, decisionObject, details);
  }
  status
    ? res.status(201).send(status)
    : next(new ErrorHandler(status.error, 400));
});

const voteInDecision = catchAsyncError(async (req, res, next) => {
  const decisionId = req.body.decisionId;
  const decision = await decisionModel.findById(decisionId);
  if (!decision) {
    return next(new ErrorHandler("Decision Not Found", 404));
  }
  if (decision.votingEndsAt < Date.now()) {
    return next(new ErrorHandler("Voting Period Ended", 400));
  }
  const user = await userModel.findById(req.id);
  if (!user.colonies.includes(decision.colony)) {
    return next(new ErrorHandler("You are not a member of this colony!", 400));
  }
  if (decision.voters.includes(req.id)) {
    return next(
      new ErrorHandler("You have already voted in this decision!", 400)
    );
  }
  if (
    req.body.stake >
    user.tokens.find((token) => token.colony == decision.colony).token
  ) {
    return next(new ErrorHandler("Insufficient Balance", 400));
  }

  if (req.body.stake !== decision.maxStake * 0.1)
    return next(
      new ErrorHandler(
        "Cannot Stake more or less than the defined amount!",
        400
      )
    );

  user.tokens.find((token) => token.colony == decision.colony).token -=
    req.body.stake;
  await user.save();

  decision.voters.push(req.id);
  decision.votes.push({
    user: req.id,
    stake: req.body.stake,
    vote: req.body.vote,
  });
  await decision.save();
  res
    .status(200)
    .json({ status: true, message: "Voted Successfully", decision });
});

const mintTokens = catchAsyncError(async (req, res, next) => {
  const colony = await colonyModel.findById(req.body.colonyId);
  if (!colony) {
    return next(new ErrorHandler("Colony Not Found", 404));
  }
  if (!colony.rootUsers.includes(req.id)) {
    return next(
      new ErrorHandler("You are not authorized to mint tokens!", 401)
    );
  }
  colony.funds += req.body.amount;
  colony.save();
  res.status(200).json({ status: true, message: "Tokens Minted", colony });
});

const promoteUser = catchAsyncError(async (req, res, next) => {
  const colony = await colonyModel.findById(req.body.colonyId);
  if (!colony) {
    return next(new ErrorHandler("Colony Not Found", 404));
  }
  if (!colony.rootUsers.includes(req.id)) {
    return next(
      new ErrorHandler("You are not authorized to promote users!", 401)
    );
  }

  const user = await userModel.findById(req.body.userId);

  if (!user.colonies.includes(req.body.colonyId)) {
    return next(new ErrorHandler("User is not a member of this colony!", 400));
  }

  if (req.body.position === "root") {
    colony.rootUsers.push(req.body.userId);
  } else {
    if (!colony.contributors.includes(req.body.userId)) {
      colony.contributors.push(req.body.userId);
    } else {
      return next(new ErrorHandler("User is already a contributor!", 400));
    }
  }

  await colony.save();
  res.status(200).json({ status: true, message: "User Promoted", colony });
});

const createExpenditure = catchAsyncError(async (req, res, next) => {
  const colony = await colonyModel.findById(req.body.colonyId);
});

module.exports = {
  colonyCreator,
  joinColony,
  createDecision,
  voteInDecision,
  mintTokens,
  promoteUser,
  createExpenditure,
};
