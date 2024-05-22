const mongoose = require("mongoose");
require("dotenv").config({
  path: "./config/.env",
});

exports.connectDB = async () => { 
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
