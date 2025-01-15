const express = require('express');
const { uploadMiddleware, grooming } = require('../controllers/geminiGroomingController');

const router = express.Router();

router.post("/grooming", uploadMiddleware, grooming);

module.exports = router;