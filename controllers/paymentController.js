const razorpayInstance = require("../config/razorayConfig");
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const genereateRecipt = require("../utils/createRecipt");
const productModel = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const userModel = require("../models/user");
const crypto = require("crypto");
const orderModel = require("../models/order");
const { validatePaymentSignature } = require("../utils/validatePaymentSignature");

exports.getKey = catchAsyncError(async (req, res, next) => {
  const key = process.env.RAZORPAY_KEY_ID;
  res.status(200).json({ key });
});

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { product_id } = req.body;

  const product = await productModel.findById(product_id);

  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  const receipt = genereateRecipt();
  const options = {
    amount: product.price * 100, // Amount in paise
    currency: "INR",
    receipt,
  };
  let order = await razorpayInstance.orders.create(options);

  const user = await userModel.findById(req.id);

  if (!order) {
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

  res.status(200).json({ success: true, order, user });
});

exports.verifyPayment = catchAsyncError(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const order = await orderModel.findOne({razorpay_order_id});

  console.log(order)
  if (validatePaymentSignature(req.body)) {
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "paid";
    console.log(order)
    await order.save();
    res.redirect(`http://localhost:5173/payment-success/${razorpay_payment_id}`);
  } else {
    return next(new ErrorHandler("Invalid signature! Please Try Again", 400));
  }
});
