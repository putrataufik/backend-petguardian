const express = require("express");
const { addPet, getPetByOwner, getPetByID } = require("../controllers/petController");

const router = express.Router();

router.post("/add", addPet);

// Route untuk mengambil semua pet berdasarkan owner
router.get("/owner/:owner", getPetByOwner);

// Route untuk mendapatkan pet berdasarkan ID
router.get('/petdetails/:petId', getPetByID);

module.exports = router;
