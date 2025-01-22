const { GoogleGenerativeAI } = require("@google/generative-ai");

const grooming = async (req, res) => {
    const { species, breed, grooming } = req.body;

    if (!species || !breed || !grooming) {
        return res.status(400).json({ error: "Species, breed, and grooming are required" });
    }

    try {
        // Inisialisasi Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Buat prompt berdasarkan data yang diterima
        const prompt = `Generate a list of 5 URLs for images of grooming styles for a pet with the following characteristics:
        
        - Species: ${species}
        - Breed: ${breed}
        - Grooming Style: ${grooming}

        Each image should correspond to the grooming style mentioned, and the URL should point to an image that best represents the grooming style for the specified pet species and breed. The URLs should be direct links to the images, such as URLs from reputable image hosting platforms. Do not include non-image links.`;

        // Generate konten menggunakan AI
        const result = await model.generateContent(prompt);
        const generatedText = result.response.text();

        // Parse hasil gambar (daftar URL gambar)
        const imageUrls = generatedText.split('\n').map(url => url.trim()).filter(url => url.startsWith("http"));
        
        // Kirimkan hasil gambar ke frontend
        res.status(200).json({ generatedText });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { grooming };
