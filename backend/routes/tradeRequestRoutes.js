const express = require("express");
const router = express.Router();
const tradeRequestController = require("../controllers/tradeRequestController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/incoming", authMiddleware, tradeRequestController.getIncomingRequests);
router.get("/outgoing", authMiddleware, tradeRequestController.getOutgoingRequests);
router.get("/", authMiddleware, tradeRequestController.getMyRequests);
router.post("/", authMiddleware, tradeRequestController.createTradeRequest);

module.exports = router;
