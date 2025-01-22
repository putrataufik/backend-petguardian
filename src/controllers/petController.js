const { db} = require("../config/firebase");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");

// Konfigurasi Multer untuk mengunggah file
const storage = multer.diskStorage({
  destination: "home/petGuardian/pet",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik untuk setiap file
  },
});
const upload = multer({ storage });
// Add pet dat
exports.addPet = async (req, res) => {
  try {
    const {
      uid,
      name,
      species,
      breed,
      age,
      careInstructions,
      feedingInstructions,
      groomingOptions,
    } = req.body;

    // Validasi data input
    if (!uid || !name || !species || !breed || !age) {
      console.log(uid, name, species, breed, age);
      return res.status(400).json({ error: "Harap lengkapi semua data yang diperlukan!" });
    }

    // Pastikan file gambar tersedia
    if (!req.file) {
      return res.status(400).json({ error: "Harap unggah file gambar!" });
    }

    // Upload gambar ke Cloudinary
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "petGuardian/pets", // Lokasi folder di Cloudinary
    });
    console.log(result)
    // Simpan data hewan ke Firestore
    const petData = {
      uid,
      name,
      species,
      breed,
      age,
      careInstructions,
      feedingInstructions,
      groomingOptions,
      imageUrl: result.secure_url, // URL gambar dari Cloudinary
      createdAt: new Date().toISOString(),
    };

    const petRef = await db.collection("pets").add(petData);

    res.status(201).json({
      message: "Data hewan berhasil ditambahkan!",
      petId: petRef.id,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};
exports.uploadMiddleware = upload.single("image");

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
};

exports.updatePetById = async (req, res) => {
  
  try{
    const petId = req.params.petId;
    const { name, species, breed, age, careInstructions, feedingInstructions} = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'name'" });
    }
    if (age && isNaN(age)) {
      return res.status(400).json({ error: "'age' should be a number" });
    }
    
    console.log("Pet Id: " + petId);
    console.log("Received body:", req.body);

    if(!petId){
      return res.status(400).json({error: "Pet ID is required!"});
    }

    const petDocRef = db.collection('pets').doc(petId);
    const petDoc = await petDocRef.get();

    if(!petDoc.exists){
      return res.status(404).json({error: "Pet not found!"});
    }
    const updatedData = {};
    if(name) updatedData.name = name;
    if(species) updatedData.species = species;
    if(breed) updatedData.breed = breed;
    if(age) updatedData.age = age;
    if(careInstructions) updatedData.careInstructions = careInstructions;
    if(feedingInstructions) updatedData.feedingInstructions = feedingInstructions;

    updatedData.updatedAt = new Date().toISOString();
    await petDocRef.update(updatedData);
    res.status(200).json({message: "Pet updated successfully!"});

  } catch (error){
    console.error("Error updating pet:", error);
    res.status(500).json({error: "Failed to update pet: " + error.message});
  }
}
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