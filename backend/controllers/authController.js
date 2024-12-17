const passport = require("passport");

exports.googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
};

exports.googleCallBack = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      req.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    }
  )(req, res, next);
};

exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.protect = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
};
