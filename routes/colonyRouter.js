const express = require("express");
const router = express.Router();
const { colonyCreator, joinColony, createDecision, voteInDecision, mintTokens, promoteUser, createExpenditure } = require("../controllers/colonyController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/create", isAuthenticated, colonyCreator);

router.get('/join', isAuthenticated, joinColony);

router.post('/create-decision/:type', isAuthenticated, createDecision);

router.post('/vote', isAuthenticated, voteInDecision);

router.post('/mint-tokens', isAuthenticated, mintTokens);

router.post('promote', isAuthenticated, promoteUser);

router.post('/createExpenditure', isAuthenticated, createExpenditure);


module.exports = router;
