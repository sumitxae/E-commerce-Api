const express = require("express");
const router = express.Router();
const { colonyCreator, joinColony } = require("../controllers/colonyController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/create", isAuthenticated, colonyCreator);

router.get('/join', isAuthenticated, joinColony);

module.exports = router;
