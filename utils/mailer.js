const mailer = require("nodemailer");
const ErroHandler = require('./errorHandler');

exports.sendEmail = async (email, url, next, res) => {
  const transport = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });
  const mailOptions = {
    from: `Colony - Dapp`,
    to: email,
    subject: "Password Reset Link",
    html: `
        <h1>Do not share this link to anyone.</h1>
        <p>Click <a href=${url}>here</a> to reset your password</p>
    `,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return next(new ErroHandler(err.message, 500));
    }
    return res.status(200).json({
        success: true,
        message: `Email sent to ${email}`,
        url
    });
  });
};
