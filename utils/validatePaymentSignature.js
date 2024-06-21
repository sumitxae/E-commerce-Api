exports.validatePaymentSignature = (payment) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    payment;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const crypto = require("crypto");
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  return generated_signature === razorpay_signature;
};
