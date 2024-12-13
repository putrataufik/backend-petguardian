const express = require("express");
const { uploadMiddleware, detectDogSkinDisease} = require("../controllers/dogSkinDiseaseController");

const router = express.Router();

// Route untuk mendeteksi penyakit kulit kucing
router.post("/detectdog", uploadMiddleware, detectDogSkinDisease);

module.exports = router;