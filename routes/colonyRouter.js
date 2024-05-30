const express = require("express");
const router = express.Router();
const { colonyCreator, joinColony, createDecision } = require("../controllers/colonyController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/create", isAuthenticated, colonyCreator);

router.get('/join', isAuthenticated, joinColony);

router.get('/crete-decision', isAuthenticated, createDecision);

module.exports = router;
