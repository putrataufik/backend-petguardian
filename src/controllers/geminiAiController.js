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

    const prompt = `
      Jenis ras apa yang dimiliki oleh hewan peliharaan saya serta bagaimana 
      ciri-ciri yang dimiliki oleh hewan peliharaan tersebut?. 
      Selain itu juga, bagaimana cara untuk merawat dan memelihara hewan 
      peliharaan ras tersebut? 
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype,
        },
      },
      prompt,
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
