const dotenv = require("dotenv");
const app = require("./app");  // Mengimpor aplikasi Express dari app.js

dotenv.config();  // Memuat variabel lingkungan dari .env
app.get("/proxy", (req, res) => {
  const url = req.query.url; // URL gambar yang diminta
  request(url).pipe(res); // Stream konten gambar ke frontend
});
// Menjalankan server pada port yang ditentukan di .env atau default ke 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
