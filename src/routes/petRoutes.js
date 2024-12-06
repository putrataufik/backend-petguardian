const express = require("express");
const { addPet } = require("../controllers/petController");

const router = express.Router();

router.post("/add", addPet);

module.exports = router;
