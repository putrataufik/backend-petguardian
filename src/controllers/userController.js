const { db } = require("../config/firebase");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
/**
 * Get User by Email
 */

/**
 * Get User by UID
 */
exports.getUserByUid = async (req, res) => {
    try {
      const { uid } = req.params;
      console.log("UID yang diterima:", uid); // Log UID yang diterima
  
      if (!uid) {
        return res.status(400).json({ error: "UID is required!" });
      }
  
      const userDoc = db.collection("users").doc(uid);
      const userSnapshot = await userDoc.get();
  
      if (!userSnapshot.exists) {
        console.log("Dokumen tidak ditemukan untuk UID:", uid); // Log jika dokumen tidak ada
        return res.status(404).json({ error: "User not found!" });
      }
  
      const userData = userSnapshot.data();
      console.log("Data pengguna ditemukan:", userData); // Log data pengguna jika ditemukan
  
      res.status(200).json({
        message: "User retrieved successfully!",
        user: userData,
      });
    } catch (error) {
      console.error("Error retrieving user by UID:", error.message);
      res.status(500).json({ error: "Failed to retrieve user!" });
    }
  };
  

/**
 * Tambah atau Update Data Pengguna
 */
const storage = multer.diskStorage({
  destination: "uploads/", // Direktori sementara untuk menyimpan file sebelum diunggah ke Cloudinary
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik untuk setiap file
  },
});
const upload = multer({ storage });

exports.updateUserByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Mengambil UID dari parameter URL
    const { name } = req.body; // Mengambil name dari body request

    // Validasi input
    if (!uid || (!name && !req.file)) {
      return res.status(400).json({ error: "UID, Name, atau Gambar harus diisi!" });
    }

    // Referensi dokumen pengguna berdasarkan UID
    const userDoc = db.collection("users").doc(uid);

    // Cek apakah pengguna sudah ada di Firestore
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "Maaf Pengguna tidak ditemukan!" });
    }

    const updateData = {};

    // Update name jika ada di body request
    if (name) {
      updateData.name = name;
    }

    // Jika ada file gambar, upload ke Cloudinary
    if (req.file) {
      const filePath = req.file.path;

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "petGuardian/users", // Lokasi folder di Cloudinary
      });

      updateData.photoURL = result.secure_url; // URL gambar yang diunggah
    }

    // Update data pengguna di Firestore
    await userDoc.update(updateData);

    res.status(200).json({ message: "User berhasil diperbarui!", data: updateData });
  } catch (error) {
    console.error("Gagal memperbarui user:", error);
    res.status(500).json({ error: `Gagal memperbarui user: ${error.message}` });
  }
};




exports.getUserSubscriptionsStatusById = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Mengambil dokumen dari koleksi subscriptions dengan userID sebagai nama dokumen
    const docRef = db.collection("subscriptions").doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "No subscription found for this user" });
    }

    const subscriptionData = doc.data();

    // Mengecek tanggal expiry
    const today = new Date();
    const expiryDate = new Date(subscriptionData.expiryDate);

    // Reset usageToken jika sudah expired atau reset waktu harian
    const currentDate = new Date();
    const lastResetDate = subscriptionData.lastResetDate ? new Date(subscriptionData.lastResetDate) : null;
    const resetTime = new Date(currentDate.setHours(0, 0, 0, 0)); // 00:00 UTC+7 reset

    // Memeriksa apakah waktu reset sudah lewat
    if (!lastResetDate || resetTime > lastResetDate) {
      // Jika belum ada reset atau sudah lewat waktu reset, reset token
      const usageToken = subscriptionData.status === "active" ? 600 : 100;
      await docRef.update({
        usageToken: usageToken,
        lastResetDate: resetTime,
      });
    }

    if (expiryDate <= today) {
      // Jika tanggal hari ini sama atau melebihi tanggal expiry, ubah status menjadi expired
      await docRef.update({ status: "expired", usageToken: 0 });

      return res.status(200).json({
        userID: uid,
        status: "expired",
        isActive: false,
        subscriptionDate: subscriptionData.subscriptionDate || null,
        expiryDate: subscriptionData.expiryDate || null,
        usageToken: 0,
      });
    }

    // Jika belum expired, tetap tampilkan data asli
    const isActive = subscriptionData.status === "active";
    const usageToken = subscriptionData.usageToken || (isActive ? 600 : 100);

    res.status(200).json({
      userID: uid,
      status: subscriptionData.status,
      isActive: isActive,
      subscriptionDate: subscriptionData.subscriptionDate || null,
      expiryDate: subscriptionData.expiryDate || null,
      usageToken: usageToken,
    });
  } catch (error) {
    console.error("Error getting subscription status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUsageTokenByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Mengambil UID dari params URL
    const { usageToken } = req.body; // Mengambil usageToken dari body request

    if (!uid || typeof usageToken !== 'number') {
      return res.status(400).json({ message: "User ID and usageToken are required" });
    }

    // Mengambil dokumen dari koleksi subscriptions dengan userID sebagai nama dokumen
    const docRef = db.collection("subscriptions").doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Subscription not found for this user" });
    }

    const subscriptionData = doc.data();

    // Perbarui usageToken sesuai dengan nilai yang diterima dari frontend
    await docRef.update({
      usageToken: usageToken, // Menggunakan nilai usageToken yang dikirim dari frontend
      lastResetDate: new Date().setHours(0, 0, 0, 0), // Reset waktu harian
    });

    return res.status(200).json({
      message: "Usage token updated successfully",
      usageToken: usageToken, // Mengirimkan nilai token yang baru
    });
  } catch (error) {
    console.error("Error updating usage token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUsageTokenByUid = async (req, res) => {
  try {
    const { uid } = req.params; // Mengambil UID dari params URL

    if (!uid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Mengambil dokumen dari koleksi subscriptions dengan userID sebagai nama dokumen
    const docRef = db.collection("subscriptions").doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Subscription not found for this user" });
    }

    const subscriptionData = doc.data();
    
    // Mengambil token sesuai dengan status
    const usageToken = subscriptionData.usageToken || (subscriptionData.status === "active" ? 600 : 100);

    return res.status(200).json({
      usageToken: usageToken,
      status: subscriptionData.status,
    });
  } catch (error) {
    console.error("Error getting usage token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

  
exports.uploadMiddleware = upload.single("image");