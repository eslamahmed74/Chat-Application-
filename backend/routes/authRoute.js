const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallBack);
router.get(
  "/logout",

  authController.logOut
);
router.get("/login", authController.logIn);
router.get("/chat", authController.protect, (req, res, next) => {
    res.send(`Welcome ${req.user.displayName}`);
});
module.exports = router;
