const mongoose = require("mongoose");

const voteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    stake: { type: Number, required: true },
    vote: { type: String, enum: ['In Favor', 'Against'], required: true },
});

const decisionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    colony: { type: Schema.Types.ObjectId, ref: 'colony', required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
    votingEndsAt: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Passed', 'Rejected'], default: 'Pending' },
    voters: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
    votes: [voteSchema],
});

const Decision = mongoose.model('Decision', decisionSchema);