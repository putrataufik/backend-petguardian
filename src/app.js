const express = require("express");
const cors = require("cors");  // Mengimpor CORS
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
dotenv.config();  // Memuat variabel lingkungan dari .env

// Import routes 
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const geminiAiRoutes = require('./routes/geminiAiRoutes.js');
const catSkinDisease = require('./routes/catSkinDiseaseRoutes.js');
const dogSkinDisease = require('./routes/dogSkinDiseaseRoutes.js');
const scheduleRoutes = require('./routes/scheduleRoutes');
const imageRoutes = require('./routes/imageRoutes.js');
const grooming=require('./routes/geminiGroomingRoutes.js');

const app = express();

// Menggunakan middleware CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",  // Frontend pada port 5173
    "https://dcab-125-166-18-150.ngrok-free.app",
    "http://192.168.1.11:5173",
    "http://192.168.1.11:3000"  // Jika menggunakan ngrok
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Menambahkan PATCH
  allowedHeaders: "Content-Type,Authorization",  // Header yang diizinkan
  credentials: true,  // Jika menggunakan cookies atau autentikasi
}));


// Menggunakan middleware untuk membaca body dari request dan error handler
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gemini', geminiAiRoutes);
app.use('/api/catskindisease', catSkinDisease);
app.use('/api/dogSkinDisease', dogSkinDisease);
app.use('/api/images', imageRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/generative', grooming);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
