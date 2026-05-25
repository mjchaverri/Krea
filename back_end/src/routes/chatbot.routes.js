const express = require("express");

const router = express.Router();

const {
    sendMessage,
} = require("../controllers/chatbot.controller");

router.post("/message", sendMessage);

module.exports = router;