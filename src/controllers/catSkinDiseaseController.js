const multer = require("multer");
const axios = require("axios");

// Konfigurasi multer
const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk menangani unggahan gambar
const uploadMiddleware = upload.single("image");

// Fungsi untuk mendeteksi penyakit kulit kucing
const detectCatSkinDisease = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File gambar diperlukan!" });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Tipe gambar tidak didukung!" });
    }

    const base64Image = Buffer.from(file.buffer).toString("base64");

    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/skin-disease-of-cat/1",
      params: {
        api_key: "jPzLnXVMZJziWTdgli5h",
      },
      data: base64Image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json({
      message: "Penyakit kulit kucing terdeteksi!",
      response: response.data,
    });
  } catch (error) {
    console.error("Error detecting cat skin disease:", error.message);
    res.status(500).json({ error: "Gagal memproses gambar!" });
  }
};

module.exports = { uploadMiddleware, detectCatSkinDisease };
