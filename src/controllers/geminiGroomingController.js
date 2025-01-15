const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Konfigurasi multer untuk unggahan file
const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk menangani unggahan gambar
const uploadMiddleware = upload.single("image");

// Fungsi untuk Generate Image Grooming
const grooming = async (req, res) => {
  try {
    const file = req.file;

    // Validasi keberadaan file gambar
    if (!file) {
      return res.status(400).json({ error: "File gambar diperlukan!" });
    }

    // Validasi tipe file
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Tipe file tidak didukung!" });
    }

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(file.buffer).toString("base64");

    // Validasi parameter input
    const { jenisHewan, jenisModel } = req.body;
    if (!jenisHewan || !jenisModel) {
      return res.status(400).json({
        error: "Parameter jenisHewan dan jenisModel harus diisi!",
      });
    }

    // Prompt untuk Generative AI
    const prompt = `Generate an image of a ${jenisHewan} that has been groomed in the style of ${jenisModel}.`;

    // Inisialisasi Google Generative AI Gemini
    const genAI = new GoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro",
    });

    // Mengirimkan permintaan ke Gemini untuk menghasilkan gambar
    const result = await model.generateContent({
      prompt, // Prompt deskriptif
      input: {
        image: {
          data: base64Image, // Gambar dalam bentuk Base64
          mimeType: file.mimetype, // Tipe MIME gambar
        },
      },
    });

    // Mengembalikan respons hasil dari Gemini
    res.status(200).json({
      message: "Gambar berhasil dihasilkan!",
      response: result,
    });
  } catch (error) {
    console.error("Error Generating Image:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses gambar!" });
  }
};

module.exports = { uploadMiddleware, grooming };
