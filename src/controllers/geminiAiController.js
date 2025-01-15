const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Konfigurasi multer
const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk menangani unggahan gambar
const uploadMiddleware = upload.single("image");

// Fungsi untuk mendeteksi ras anjing atau kucing
const detectAnimalBreed = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image file is required!" });
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
      return res.status(400).json({ error: "Unsupported image type!" });
    }

    const base64Image = Buffer.from(file.buffer).toString("base64");
    const currentBW = req.body.currentBW; // Mengambil currentBW dari body request
    const age = req.body.age; // Mengambil age dari body request

    const promptBW = `Bisakah anda berikan saya jawaban dari gambar yang saya berikan mengenai jenis ras apa yang dimilikinya (berikan saya jawaban cukup dengan 2 kata saja yaitu jenis hewan peliharaannya kucing atau anjing dan rasnya). Hewan ini berumur ${age} bulan dan juga berat badannya ${currentBW}, bagaimana cara untuk merawat dan memeliharanya dan cara memberi makan yang sesuai dengan umur ${age} bulan (berikan merek rekomendasi makanan yang cocok), dan model grooming yang sesuai dengan jenis ras yang dimiliki (berikan 5 model dan tidak memberikan penjelasan cukup model groomingnya saja). Namun saya ingin jawaban yang anda berikan diberi penanda atau pemisah antara jawaban yang semua saya inginkan, contohnya sebagai berikut ini:
    
Hewan:
Jenis ras:
Cara merawat dan memelihara:
Cara Memberi makan:
Model Grooming:`;

    const prompt = `Bisakah anda berikan saya jawaban dari gambar yang saya berikan mengenai jenis ras apa yang dimilikinya (berikan saya jawaban cukup dengan 2 kata saja yaitu jenis hewan peliharaannya kucing atau anjing dan rasnya), bagaimana cara untuk merawat dan memeliharanya, bagaimana cara memberi makan yang sesuai beratnya, dan model grooming yang sesuai dengan jenis ras yang dimiliki (berikan 5 model dan tidak memberikan penjelasan cukup model groomingnya saja). Namun saya ingin jawaban yang anda berikan diberi penanda atau pemisah antara jawaban yang semua saya inginkan, contohnya sebagai berikut ini:

Hewan:
Jenis ras:
Cara merawatnya:
Cara memberi makan:
Model Grooming:`;

    // Pilih prompt berdasarkan keberadaan currentBW
    const selectedPrompt = currentBW ? promptBW : prompt;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype,
        },
      },
      selectedPrompt,
    ]);

    res.status(200).json({
      message: "Ras hewan terdeteksi!",
      response: result.response.text(),
    });
  } catch (error) {
    console.error("Error detecting animal breed:", error.message);
    res.status(500).json({ error: "Failed to process the image!" });
  }
};

module.exports = { uploadMiddleware, detectAnimalBreed };
