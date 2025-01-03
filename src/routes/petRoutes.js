const express = require("express");
const { addPet, getPetByUid, getPetByID, deletePet } = require("../controllers/petController");

const router = express.Router();

router.post("/add", addPet);

// Route untuk mengambil semua pet berdasarkan owner
router.get("/owner/:uid", getPetByUid);

// Route untuk mendapatkan pet berdasarkan ID
router.get('/petdetails/:petId', getPetByID);

router.get('/petdetails/:petID', deletePet);

module.exports = router;
