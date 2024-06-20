const razorpayInstance = require("../config/razorayConfig");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const genereateRecipt = require("../utils/createRecipt");
const productModel = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const userModel = require("../models/user");
const crypto = require("crypto");
const orderModel = require("../models/order"); 

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { product_id } = req.body;

  const product = await productModel.findById(product_id);

  const receipt = genereateRecipt();
  const options = {
    amount: product.price * 100, // Amount in paise
    currency: "INR",
    receipt,
    payment_capture: 1,
  };
  let order = null;

  try{
    order = await razorpayInstance.orders.create(options);
  } catch (error) {
    console.log(error)
  }
  const user = await userModel.findById(req.id);

  if(!order) {
    return next(new ErrorHandler("Order not created!", 400));
  }

  const newOrder = new orderModel({
    razorpay_order_id: order.id,
    amount: product.price,
    createdBy: req.id,
    product_id,
    receipt,
  });

  user.orders.push(newOrder._id);
  await newOrder.save();
  await user.save();

  res.json({user, order});
});

exports.verifyPayment = catchAsyncError(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    const order = await orderModel.findOne({ razorpay_order_id });
    if (!order) {
      return next(new ErrorHandler("Order not found!", 404));
    }
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "paid";
    await order.save();

    res.status(200).json({ status: "success", order });
  } else {
    return next(new ErrorHandler("Invalid signature! Please Try Again", 400));
  }
});