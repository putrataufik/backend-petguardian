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
  origin: "http://localhost:5173",  // Izinkan hanya dari frontend (port yang benar)
  methods: "GET,POST",  // Izinkan metode GET dan POST
  allowedHeaders: "Content-Type,Authorization",  // Izinkan header yang diperlukan
}));

// Tambahkan routes Anda di bawah ini
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
