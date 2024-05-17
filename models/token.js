const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({   
    tokenName: {
        type: String,
        default: null,
    },
    tokenSymbol: {
        type: String,
        default: null,
    },
    tokenColony: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colony",
        required: true,
    },
});