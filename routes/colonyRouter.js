const express = require("express");
const router = express.Router();
const { colonyCreator } = require("../controllers/colonyController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/create", isAuthenticated, colonyCreator);

module.exports = router;
