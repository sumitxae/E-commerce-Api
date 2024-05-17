export const registerController = async (req, res) => {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel
    .register(newUser, req.body.pasword)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

export const loginController = (req, res) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  });
};

export const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
