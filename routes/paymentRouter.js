const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/createOrder", isAuthenticated, createOrder);
router.post("/verifyPayment", isAuthenticated, verifyPayment); 

module.exports = router;
