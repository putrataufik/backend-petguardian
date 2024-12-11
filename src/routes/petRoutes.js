const express = require("express");
const { addPet, getPetByOwner } = require("../controllers/petController");

const router = express.Router();

router.post("/add", addPet);

// Route untuk mengambil semua pet berdasarkan owner
router.get("/owner/:owner", getPetByOwner);

module.exports = router;
