const { generateAIContent } = require("../services/aiService");

exports.generateContent = async (req, res) => {
  try {
    const {
      topic,
      audience,
      goals,
      contentType,
      keywords,
      challenges,
      voice,
      excludeTitles,
    } = req.body;

    // ✅ Strong validation
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "Valid topic is required",
      });
    }

    // ✅ Pass FULL OBJECT (FIXED BUG)
    const aiInput = {
      topic: topic.trim(),
      audience,
      goals,
      contentType,
      keywords,
      challenges,
      voice,
      excludeTitles,
    };

    console.log("🚀 AI INPUT:", aiInput);

    const data = await generateAIContent(aiInput);

    console.log("🔥 AI OUTPUT COUNT:", data?.length);

    // ✅ Safety check (never break frontend)
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("❌ CONTROLLER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to generate AI content",
    });
  }
};