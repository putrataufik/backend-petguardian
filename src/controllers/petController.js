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
exports.getPetByID = async (req, res) => {
  try {
    const { petId } = req.params;

    if (!petId) {
      return res.status(400).json({ error: "Pet ID is required!" });
    }

    // Query Firestore untuk mendapatkan pet berdasarkan ID
    const petDoc = await db.collection("pets").doc(petId).get();

    if (!petDoc.exists) {
      return res.status(404).json({ error: "Pet not found!" });
    }

    // Return data pet
    res.status(200).json({ petId: petDoc.id, ...petDoc.data() });
  } catch (error) {
    console.error("Error getting pet by ID:", error.message);
    res.status(500).json({ error: error.message });
  }
};


