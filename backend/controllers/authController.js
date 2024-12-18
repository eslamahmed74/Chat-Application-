const passport = require("passport");

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallBack = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/api/v1/auth/login" },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/api/v1/auth/login");

      req.logIn(user, (err) => {
        if (err) return next(err);

        // Ensure the user is redirected to the correct place after login
        res.redirect("/api/v1/auth/chat"); // Redirect to home page or desired route
      });
    }
  )(req, res, next); // This ensures the middleware is invoked correctly
};
exports.logOut = (req, res, next) => {
  console.log("Logout route hit");
  console.log("User logged out at:", new Date().toISOString());

  // Prevent caching
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  // Perform logout
  req.logOut((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return next(err); // Pass error to the next middleware
    }

    // Clear user session (important for Passport)
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Error destroying session:", sessionErr);
        return next(sessionErr); // Handle session destruction error
      }

      // Clear session cookie and send a single response
      res.clearCookie("connect.sid"); // Clear session cookie
      res.redirect("/api/v1/auth/login"); // Redirect to the login page
    });
  });
};

exports.logIn = (req, res, next) => {
  res.send("<a href='/api/v1/auth/google'>Login with Google</a>");
};

exports.protect = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/v1/auth/login"); // Redirect to login if not authenticated
};
