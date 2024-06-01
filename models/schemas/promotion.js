const mongoose = require("mongoose");
const Decision = require("../decision");

const promoterSchema = new mongoose.Schema(
  {
    promoted: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    promoter: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    colony: { type: mongoose.Types.ObjectId, ref: "colony", required: true },
  },
  { id: false }
);

const promoteDecision = Decision.discriminator(
  "Promote",
  new mongoose.Schema({
    details: { type: promoterSchema, required: true },
  })
);

module.exports = promoteDecision;
