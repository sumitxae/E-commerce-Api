var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const path = require('path');
const cors = require("cors");
const expressSession = require("express-session");

require("dotenv").config({
  path: "./config/.env",
});
require("./config/db").connectDB();
const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const ErrorHandler = require("./utils/errorHandler");
const { generatedError } = require("./middlewares/error");
const paymentRouter = require("./routes/paymentRouter");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://e-commerce-k2r4.onrender.com'
  ],
  credentials: true,
}));

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.set('trust proxy', 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/payments", paymentRouter);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Page Not Found ${req.url}`, 404));
});

app.use(generatedError);

app.listen(
  process.env.PORT,
  console.log(`Server is running on port ${process.env.PORT}`)
);

module.exports = app;
