const { db, admin } = require("../config/firebase");

// Add pet data
exports.addPet = async (req, res) => {
  try {
    const { owner, name, species, breed, age, } = req.body;

    if (!owner || !name || !species || !breed || !age) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const petData = {
      owner,
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
// Get all pets by owner
exports.getPetByOwner = async (req, res) => {
  try {
    const { owner } = req.params;

    if (!owner) {
      return res.status(400).json({ error: "Owner ID is required!" });
    }

    // Query Firestore untuk mendapatkan semua pet milik owner tertentu
    const petsSnapshot = await db.collection("pets").where("owner", "==", owner).get();

    if (petsSnapshot.empty) {
      return res.status(404).json({ error: "No pets found for this owner!" });
    }

    // Loop melalui semua dokumen dan buat array data
    const pets = [];
    petsSnapshot.forEach((doc) => {
      pets.push({ petId: doc.id, ...doc.data() });
    });

    // Return daftar pets
    res.status(200).json({ pets });
  } catch (error) {
    console.error("Error getting pets by owner:", error.message);
    res.status(500).json({ error: error.message });
  }
};

