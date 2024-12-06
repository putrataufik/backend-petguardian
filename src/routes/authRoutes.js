const express = require("express");
const { registerUser, loginWithToken, loginWithGoogle } = require("../controllers/authController");

const router = express.Router();

// Register new user with Email and Password
router.post("/register", registerUser);

// Login using Firebase ID Token (sent from frontend after successful login)
router.post("/login", loginWithToken);

// Google Login route
router.post("/login/google", loginWithGoogle);


module.exports = router;