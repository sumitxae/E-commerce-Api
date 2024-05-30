const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    stake: { type: Number, required: true },
    vote: { type: String, enum: ['In Favor', 'Against'], required: true },
});

const decisionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    colony: { type: mongoose.Types.ObjectId, ref: 'colony', required: true },
    creator: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
    votingEndsAt: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Passed', 'Rejected'], default: 'Pending' },
    voters: [{ type: mongoose.Types.ObjectId, ref: 'user', default: [] }],
    votes: [voteSchema],
});

module.exports =  mongoose.model('Decision', decisionSchema);