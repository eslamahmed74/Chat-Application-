const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const authRoute = require("./routes/authRoute");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const path = require("path");
const favicon = require("serve-favicon");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(morgan("dev"));
require("./config/passport");
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/", (req, res, next) => {
  res.send("<a href='/api/v1/auth/google'>Login with Google</a>");
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
