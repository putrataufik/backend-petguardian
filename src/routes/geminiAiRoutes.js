const express = require("express");

const { detectAnimalBreed, uploadMiddleware } = require("../controllers/geminiAiController.js");

const router = express.Router();

// Route untuk mendeteksi ras hewan
router.post("/detect-animal-breed", uploadMiddleware, detectAnimalBreed);

module.exports = router;