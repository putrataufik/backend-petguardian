const { db } = require("../config/firebase");

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

exports.addOrUpdateUser = async (req, res) => {
    try {
      const { uid, name, email, picture } = req.body;
  
      if (!uid || !name || !email) {
        return res.status(400).json({ error: "UID, name, dan email wajib diisi!" });
      }
  
      // Referensi dokumen pengguna berdasarkan UID
      const userDoc = db.collection("users").doc(uid);
  
      // Cek apakah pengguna sudah ada di Firestore
      const userSnapshot = await userDoc.get();
  
      if (userSnapshot.exists) {
        // Jika pengguna sudah ada, lakukan update
        await userDoc.update({
          name,
          email,
          picture: picture || null, // Jika photoURL tidak ada, gunakan null
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
  
        res.status(200).json({ message: "User berhasil diperbarui!" });
      } else {
        // Jika pengguna belum ada, tambahkan data baru
        await userDoc.set({
          name,
          email,
          picture: picture || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
  
        res.status(201).json({ message: "User berhasil ditambahkan!" });
      }
    } catch (error) {
      console.error("Error menambahkan/memperbarui user:", error.message);
      res.status(500).json({ error: "Gagal menambahkan atau memperbarui user!" });
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
        return res
          .status(404)
          .json({ message: "No subscription found for this user" });
      }
  
      const subscriptionData = doc.data();
  
      // Mengecek tanggal expiry
      const today = new Date();
      const expiryDate = new Date(subscriptionData.expiryDate);
  
      if (expiryDate <= today) {
        // Jika tanggal hari ini sama atau melebihi tanggal expiry, ubah status menjadi expired
        await docRef.update({ status: "expired" });
  
        return res.status(200).json({
          userID: uid,
          status: "expired",
          isActive: false,
          subscriptionDate: subscriptionData.subscriptionDate || null,
          expiryDate: subscriptionData.expiryDate || null,
        });
      }
  
      // Jika belum expired, tetap tampilkan data asli
      const isActive = subscriptionData.status === "active";
  
      res.status(200).json({
        userID: uid,
        status: subscriptionData.status,
        isActive: isActive,
        subscriptionDate: subscriptionData.subscriptionDate || null,
        expiryDate: subscriptionData.expiryDate || null,
      });
    } catch (error) {
      console.error("Error getting subscription status:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  