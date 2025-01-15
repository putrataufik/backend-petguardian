const { admin, db } = require("../config/firebase");

/**
 * Login dengan Firebase ID Token yang dikirimkan oleh frontend
 */

exports.loginWithToken = async (req, res) => {
  try {
    

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required!" });
    }

    // Verifikasi token yang dikirim dari frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Jika token valid, kembalikan informasi pengguna
    const { uid, email, name } = decodedToken;

    res.status(200).json({
      message: "Login successful!",
      uid,
      email,
      name,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid token!" });
  }
};

/**
 * Register User with Email and Password (using Firebase Admin SDK)
 */
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Buat pengguna di Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Simpan data pengguna ke Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name: name,
      email: email,
      photoURL: userRecord.photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Tambahkan dokumen kosong di koleksi subscriptions dengan nama doc sesuai uid
    await db.collection("subscriptions").doc(userRecord.uid).set({
      status: "pending",
      subscriptionDate: "",
      expiryDate: "",
      isActive: false,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log(req.body);

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required!" });
    }

    // Verifikasi ID Token dari Google
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decodedToken;

    // Cek apakah pengguna sudah ada di Firestore
    const userDoc = db.collection("users").doc(uid);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      // Jika pengguna belum ada, tambahkan ke Firestore
      await userDoc.set({
        name: name,
        email: email,
        picture: picture || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Cek dan buat dokumen di koleksi subscriptions
    const subscriptionDoc = db.collection("subscriptions").doc(uid);
    const subscriptionSnapshot = await subscriptionDoc.get();

    if (!subscriptionSnapshot.exists) {
      // Jika dokumen belum ada, tambahkan dokumen baru dengan field kosong
      await subscriptionDoc.set({
        status: "pending",
        subscriptionDate: "",
        expiryDate: "",
        isActive: false,
      });
    }

    // // cek dan buat dokumen di koleksi pets
    // const petDoc = db.collection("pets").doc(uid);
    // const petSnapshot = await petDoc.get();

    // if (!petSnapshot.exists) {
    //   // Jika dokumen belum ada, tambahkan dokumen baru dengan field kosong
    //   await petDoc.set({
    //     uid: uid,
    //     name: "",
    //     species: "",
    //     breed: "",
    //     age:null,
    //     createdAt: new Date().toISOString(),
    //   });
    // }

    // // cek dan buat dokumen di koleksi schedules
    // const scheduleDoc = db.collection("schedules").doc(uid);
    // const scheduleSnapshot = await scheduleDoc.get();
    // if (!scheduleSnapshot.exists) {
    //   // Jika dokumen belum ada, tambahkan dokumen baru dengan
    //   await scheduleDoc.set({
    //     uid: uid,
    //     event:"",
    //     location: "",
    //     time:"",
    //     date:"",
    //     note:"",
    //   createdAt: new Date().toISOString(),
    //   })
    // }

    res.status(200).json({
      message: "Login successful!",
      uid,
      email,
      name,
    });
  } catch (error) {
    console.error("Error verifying token or saving user:", error.message);
    res.status(401).json({ error: "Invalid token or failed to save user!" });
  }
};




