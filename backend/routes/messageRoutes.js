const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/trade-request/:tradeRequestId", authMiddleware, messageController.getMessagesByTradeRequest);
router.post("/", authMiddleware, messageController.sendMessage);

module.exports = router;
