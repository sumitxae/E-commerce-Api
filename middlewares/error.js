const { stack } = require("../app");

exports.generatedError = (err, req, res, next) => {
    const statsuCode = err.statusCode || 500;
    
    if (err.name === "MongoServerError" && err.message.includes("E11000")) {
        return res.status(400).send({
            message: "User already exists with this email!"
        });
    }

    res.status(statsuCode).send({
        message: err.message,
        name: err.name,
    });
};
