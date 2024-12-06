const { db } = require("../config/firebase");

// Add pet data
exports.addPet = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body;

    if (!name || !species || !breed || !age) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const petData = {
      name,
      species,
      breed,
      age,
      createdAt: new Date().toISOString(),
    };

    // Add pet to Firestore
    const petRef = await db.collection("pets").add(petData);

    res.status(201).json({ message: "Pet added successfully!", petId: petRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
