const express = require("express");
const { registerWithEmail, loginWithEmail, loginWithToken } = require("../controllers/authController");

const router = express.Router();

// Register new user with Email and Password
router.post("/register", registerWithEmail);

// Login using Firebase ID Token (sent from frontend after successful login)
router.post("/login", loginWithToken);

// Optionally, add login with email and password as another endpoint if needed
router.post("/login-with-email", loginWithEmail);

module.exports = router;