const { admin } = require("../config/firebase");

exports.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required!" });
    }

    // Verifikasi token yang dikirim dari frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    res.status(200).json({
      message: "Login successful!",
      uid,
      email,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    res.status(401).json({ error: "Invalid Google token!" });
  }
};

/**
 * Login dengan Firebase ID Token yang dikirimkan oleh frontend
 */
exports.loginWithToken = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Tambahkan log untuk memeriksa body jgn lupa hapus

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
exports.registerWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // Create user in Firebase Authentication
    const user = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({ message: "User registered successfully!", userId: user.uid });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Login User with Email and Password (using Firebase Client SDK on Frontend)
 * This function expects an ID token from frontend after successful login
 */
exports.loginWithEmail = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required!" });
    }

    // Verify the ID token received from frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    res.status(200).json({
      message: "Login successful!",
      uid,
      email,
    });

  } catch (error) {
    console.error("Error verifying ID token:", error.message);
    res.status(401).json({ error: "Invalid token!" });
  }
};