const express = require("express");
const dotenv = require("dotenv");
const app = express();
const passport = require("passport");
const session = require("express-session");
const authRoute = require("./routes/authRoute");
const mongoose = require("mongoose");
dotenv.config({});

const DB = `${process.env.MONGODB_URL}`;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(process.env.MONGODB_URL);
    console.log(`Error connecting to MongoDB : ${err}`);
  });

require("./config/passport");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", authRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`app running on port ${process.env.PORT}`);
});
