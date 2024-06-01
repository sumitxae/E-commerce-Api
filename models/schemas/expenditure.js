const mongoose = require("mongoose");
const Decision = require("../decision");
const paymentSchema = new mongoose.Schema(
  {
    payer: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    reciever: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    amount: { type: Number, required: true },
  },
  { id: false }
);

const paymentDecision = Decision.discriminator(
  "Expenditure",
  new mongoose.Schema({
    details: { type: paymentSchema, required: true },
  })
);

module.exports = paymentDecision;
