const express = require("express");
const { uploadMiddleware, detectCatSkinDisease } = require("../controllers/catSkinDiseaseController");

const router = express.Router();

// Route untuk mendeteksi penyakit kulit kucing
router.post("/detectcat", uploadMiddleware, detectCatSkinDisease);

module.exports = router;