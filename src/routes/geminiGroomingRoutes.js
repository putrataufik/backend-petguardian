const express = require('express');
const {grooming } = require('../controllers/geminiGroomingController');

const router = express.Router();

router.post("/grooming", grooming);

module.exports = router;