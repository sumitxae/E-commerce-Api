require("dotenv").config({
  path: "./config/.env",
});
require("./config/db").connectDB();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const expressSession = require("express-session");

const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const ErrorHandler = require("./utils/errorHandler");
const { generatedError } = require("./middlewares/error");
const decisionUpdater = require("./utils/updateDecisions");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Page Not Found ${req.url}`, 404));
});

app.use(generatedError);
setInterval(decisionUpdater, 60 * 1000); 

app.listen(
  process.env.PORT,
  console.log(`Server is running on port ${process.env.PORT}`)
);

module.exports = app;
