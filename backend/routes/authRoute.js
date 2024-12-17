const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallBack);
router.get("/logout", authController.logOut);

module.exports = router;
