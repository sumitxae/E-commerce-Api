exports.generatedError = (err, req, res, next) => {
    const statsuCode = err.statusCode || 500;
    res.status(statsuCode).send({
        message: err.message,
        name: err.name
    });
};
