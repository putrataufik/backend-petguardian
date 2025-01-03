const { db, admin } = require("../config/firebase");

// Add pet data
exports.addPet = async (req, res) => {
  try {
    const { uid, name, species, breed, age } = req.body;

    if (!uid || !name || !species || !breed || !age) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const petData = {
      uid, // Use uid instead of owner
      name,
      species,
      breed,
      age,
      createdAt: new Date().toISOString(),
    };

    // Add pet to Firestore
    const petRef = await db.collection("pets").add(petData);

    res
      .status(201)
      .json({ message: "Pet added successfully!", petId: petRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all pets by owner
exports.getPetByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Replace 'owner' with 'uid'

    if (!uid) {
      return res.status(400).json({ error: "Pet UID is required!" });
    }

    // Query Firestore for pets with the specified UID
    const petsSnapshot = await db
      .collection("pets")
      .where("uid", "==", uid)
      .get();

    if (petsSnapshot.empty) {
      // Use 404 for not found
      return res.status(404).json({ error: "No pets found with this UID!" });
    }

    // Process data from all documents found
    const pets = [];
    petsSnapshot.forEach((doc) => {
      pets.push({ petId: doc.id, ...doc.data() });
    });

    res.status(200).json({ pets });
  } catch (error) {
    console.error("Error getting pet by UID:", error.message);
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

exports.deletePet = function (req, res) {
  const { petId } = req.params;

  if (!petId) {
    return res.status(400).json({ error: "Pet ID is required!" });
  }

  db.collection("pets")
    .doc(petId)
    .delete()
    .then(() => {
      res.status(200).json({ message: "Pet deleted successfully!" });
    })
    .catch((error) => {
      console.error("Error deleting pet:", error.message);
      res.status(500).json({ error: error.message });
    });
}