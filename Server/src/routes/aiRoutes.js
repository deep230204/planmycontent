const express = require("express");
const router = express.Router();

const { generateContent } = require("../controllers/aiController");

// AI Routes
router.post("/generate", generateContent);

module.exports = router;