const dotenv = require("dotenv");
const app = require("./app");  // Mengimpor aplikasi Express dari app.js

dotenv.config();  // Memuat variabel lingkungan dari .env

// Menjalankan server pada port yang ditentukan di .env atau default ke 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
