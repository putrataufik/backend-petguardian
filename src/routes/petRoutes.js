const express = require("express");
const { addPet, getPetByUid, getPetByID, deletePet, updatePetById, uploadMiddleware } = require("../controllers/petController");

const router = express.Router();

router.post("/add", uploadMiddleware, addPet);


// Route untuk mengambil semua pet berdasarkan owner
router.get("/owner/:uid", getPetByUid);

// Route untuk mendapatkan pet berdasarkan ID
router.get('/petdetails/:petId', getPetByID);

router.delete('/deletePet/:petId', deletePet);

router.post("/updatePet/:petId", updatePetById);
module.exports = router;
