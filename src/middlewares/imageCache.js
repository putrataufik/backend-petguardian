const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Fungsi middleware untuk caching gambar
const imageCacheMiddleware = async (req, res, next) => {
  const { url } = req.query; // URL gambar dari query parameter
  if (!url) return res.status(400).json({ error: "URL gambar diperlukan." });

  try {
    // Lokasi penyimpanan cache
    const cacheDir = path.resolve(__dirname, "../cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir); // Buat direktori jika belum ada
    }

    // Hash nama file berdasarkan URL agar unik
    const fileName = encodeURIComponent(url);
    const filePath = path.join(cacheDir, fileName);

    // Jika gambar sudah di-cache, kembalikan gambar
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }

    // Jika tidak, unduh gambar dari URL
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    // Simpan gambar ke file
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      res.sendFile(filePath);
    });
    writer.on("error", (err) => {
      fs.unlinkSync(filePath); // Hapus file jika gagal
      next(err); // Oper ke error handler
    });
  } catch (error) {
    next(error); // Oper error ke middleware berikutnya
  }
};

module.exports = imageCacheMiddleware;
