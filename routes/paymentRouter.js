const express = require("express");
const router = express.Router();
const {
  createOrder,
  getKey,
  verifyPayment,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/authoriser");

router.post("/createOrder", isAuthenticated, createOrder);
router.post("/getKey", isAuthenticated, getKey);
router.post("/verifyPayment", verifyPayment);

module.exports = router;
