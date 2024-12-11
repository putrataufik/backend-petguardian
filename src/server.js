const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

// Middleware untuk parsing JSON
app.use(express.json()); // Ini untuk memastikan req.body bisa diakses dengan benar
app.use(express.urlencoded({ extended: true })); // Jika perlu untuk parsing data URL encoded

// Middleware CORS untuk mengizinkan permintaan dari frontend
app.use(cors({
  origin: [
    "http://localhost:5173",  // Origin untuk localhost saat pengembangan
    "https://58ea-103-52-17-4.ngrok-free.app",  // Origin untuk URL ngrok
  ],  // Izinkan hanya dari frontend (port yang benar)
  methods: "GET,POST",  // Izinkan metode GET dan POST
  allowedHeaders: "Content-Type,Authorization",  // Izinkan header yang diperlukan
}));

// Tambahkan routes Anda di bawah ini
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const subscriptionRoutes = require('./routes/subscriptionRoutes');

app.use('/api/subscriptions', subscriptionRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
