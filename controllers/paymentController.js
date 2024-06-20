const razorpayInstance = require("../config/razorpayConfig");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const genereateRecipt = require("../utils/createRecipt");
const crypto = require("crypto");

exports.createOrder = catchAsyncError(async (req, res) => {
  const { amount } = req.body;
  const receipt = genereateRecipt();
  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt,
    payment_capture: 1,
  };
  const order = await razorpayInstance.orders.create(options);
  res.json(order);
});

exports.verifyPayment = catchAsyncError((req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  // Generate the signature
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    new ErrorHandler("Invalid signature! Please Try Again", 400);
  }
});
