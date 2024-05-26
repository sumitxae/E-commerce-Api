exports.sendToken = (user, statusCode, res) => {
  const token = user.getjwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: user._id,
    token,
  });
};
