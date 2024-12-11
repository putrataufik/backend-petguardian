const admin = require("firebase-admin");
const serviceAccount = require("../../petguardian-b4891-firebase-adminsdk-guzhl-fee065d3a7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petguardian-b4891.firebaseio.com",
});

const db = admin.firestore(); // Menginisialisasi Firestore
module.exports = { admin, db }; // Ekspor db untuk digunakan di controller
