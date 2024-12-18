const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.route("/").get(chatController.getChats).post(chatController.createChat);

module.exports = router;
