const axios = require('axios');
const Decision = require("../models/decision");

const updateDecision = async function () {
  const now = new Date();
  const motionsToUpdate = await Decision.find({
    votingEndsAt: { $lt: now },
    status: "Pending",
  }).exec();

  for (let motion of motionsToUpdate) {
    let inFavorStake = 0;
    let againstStake = 0;

    for (let vote of motion.votes) {
      if (vote.vote === "In Favor") {
        inFavorStake += vote.stake;
      } else {
        againstStake += vote.stake;
      }
    }

    const newStatus = inFavorStake > againstStake ? "Passed" : "Rejected";

    await Decision.updateOne(
      { _id: motion._id },
      { $set: { status: newStatus } }
    );

    const endpointUrl = req.protocol + "://" + req.get("host");
    
    if (newStatus === "Passed") {
      try {
        let response;
        switch (motion.type) {
          case 'Payment':
            console.log('Payment decision details:', motion.details);
            response = await axios.post(`${endpointUrl}/createExpenditure`, motion.details);
            break;
          case 'Promote':
            console.log('Promote decision details:', motion.details);
            response = await axios.post(`${endpointUrl}/promote`, motion.details);
            break;
          case 'MintTokens':
            console.log('MintTokens decision details:', motion.details);
            response = await axios.post(`${endpointUrl}/mint-tokens`, motion.details);
            break;
          default:
            console.log('Unknown decision type');
        }
        console.log('Action response:', response.data);
      } catch (error) {
        console.error(`Error processing ${motion.type} decision:`, error);
      }
    }
  }
};

module.exports = updateDecision;
