const express = require("express");
const imageCacheMiddleware = require("../middlewares/imageCache");

const router = express.Router();

// Route untuk caching gambar
router.get("/cache", imageCacheMiddleware);

module.exports = router;
