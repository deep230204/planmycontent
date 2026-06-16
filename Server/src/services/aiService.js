const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateAIContent = async (data = {}) => {
  try {
    const {
      topic,
      audience,
      goals,
      contentType,
      keywords,
      challenges,
      voice,
      refinement,
      excludeTitles,
    } = data;

    // ✅ VALIDATION
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      throw new Error("Topic is required");
    }

    console.log("📌 TOPIC RECEIVED:", topic);
    console.log("🧠 MODE:", refinement ? "REFINEMENT (5 ideas)" : "NORMAL (10 ideas)");

    const requiredCount = refinement ? 5 : 10;

    const tones = Array.isArray(voice?.tone) ? voice.tone.join(", ") : (voice?.tone || "Professional");
    const platforms = Array.isArray(contentType?.platforms) ? contentType.platforms.join(", ") : (contentType?.platforms || "Instagram");
    const contentTypes = Array.isArray(contentType?.contentTypes) ? contentType.contentTypes.join(", ") : (contentType?.contentTypes || "Posts");
    const goalList = Array.isArray(goals?.primaryGoal) ? goals.primaryGoal.join(", ") : (goals?.primaryGoal || "Brand Awareness");
    const challengeList = Array.isArray(challenges?.challenges) ? challenges.challenges.join(", ") : (challenges?.challenges || "Low engagement");

    const prompt = `
STRICT JSON MODE

Return ONLY a valid JSON array.
No explanation.
No markdown.

Generate EXACTLY ${requiredCount} HIGHLY PERSONALIZED content ideas.

🚨 MANDATORY RULES:
- Every idea MUST be based on the provided context
- MUST reflect the audience type clearly
- MUST include industry-specific language
- MUST naturally include at least one keyword in the title or hook
- MUST align with selected platforms and content type
- MUST address real challenges mentioned
- EACH idea MUST have a UNIQUE, hyper-specific 'description' (max 20 words) explaining the core value. DO NOT repeat the same sentences.
- EACH idea MUST have a UNIQUE, hyper-specific 'painPoint' that explains exactly what specific problem that specific content idea solves for the audience. DO NOT repeat global frustrations.
- EACH idea MUST have a distinct 'angle' (e.g., educational breakdown, storytelling, contrarian, myth-busting, behind-the-scenes). DO NOT use the same angle for more than 2 ideas.
- MUST match the brand voice

❌ DO NOT:
- Do NOT generate generic ideas
- Do NOT use vague titles
- Do NOT repeat the same description, angle, or pain point across multiple cards
- Do NOT start multiple painPoint fields with the same opening phrase like "Difficulty in", "Struggling with", or "How to". Start directly with the friction or target the specific problem.

Format:
[
  {
    "title": "Specific, personalized title using keywords",
    "description": "Unique, high-impact summary of this specific idea",
    "hook": "Audience-specific hook",
    "angle": "Unique perspective (max 3 words)",
    "painPoint": "Specific problem this post solves",
    "platform": "Instagram | LinkedIn | YouTube",
    "type": "Short-form Video | Carousel | Blog",
    "engagement": "High | Medium",
    "difficulty": "Easy | Medium | Hard"
  }
]

🎯 CONTEXT:
Topic: ${topic}
Audience: ${audience?.audienceType || "General"} (${audience?.industry || "General Industry"})
Target Profile: ${audience?.profession || "General"}
Primary Goals: ${goalList}
Platforms: ${platforms}
Content Formats: ${contentTypes}
Keywords: ${Array.isArray(keywords?.primary) ? keywords.primary.join(", ") : "Growth"}
Challenges: ${challengeList}
Pain Points: ${challenges?.frustration || "None mentioned"}
Voice/Tone: ${tones}

${
  refinement
    ? `
REFINEMENT MODE:
- Improve previous idea significantly
- Avoid repetition
- Use feedback strictly
User Feedback: ${refinement?.feedback || "None"}
`
    : ""
}

${
  Array.isArray(excludeTitles) && excludeTitles.length > 0
    ? `
UNIFORMITY & VARIETY RULES:
- DO NOT repeat or closely paraphrase these existing idea titles: ${excludeTitles.join(", ")}
- Ensure the new batch is clearly distinct from the titles mentioned above.
`
    : ""
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    let text = response?.choices?.[0]?.message?.content || "";

    // 🧹 CLEAN MARKDOWN
    text = text.replace(/```json|```/g, "").trim();

    let parsed = [];

    // 🔥 SAFE JSON PARSER
    try {
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");

      if (start !== -1 && end !== -1) {
        const cleaned = text.substring(start, end + 1);
        parsed = JSON.parse(cleaned);
      } else {
        throw new Error("No JSON array found");
      }
    } catch (err) {
      console.log("❌ PARSING FAILED:", err.message);
      parsed = [];
    }

    // ❌ If parsing failed or empty → dynamic fallback
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const challengeList = Array.isArray(challenges?.challenges) ? challenges.challenges : ["Low engagement"];
      const platformList = Array.isArray(contentType?.platforms) ? contentType.platforms : ["Instagram"];
      const typeList = Array.isArray(contentType?.contentTypes) ? contentType.contentTypes : ["Post"];
      const industry = audience?.industry || "your industry";

      const painPointTemplates = [
        `Solving the struggle of ${challengeList[0]} through smarter content.`,
        `The hidden reason why your current strategy fails and how to fix it.`,
        `Overcoming ${challenges?.frustration || "low reach"} by mastering new formats.`,
        `Stopping the cycle of inconsistent growth with a targeted ${typeList[0]}.`,
        `Why ${industry.toLowerCase()} audiences ignore generic posts (and how to win them back).`,
      ];

      const angleTemplates = [
        "Educational Deep-dive",
        "Storytelling Hook",
        "Behind-the-Scenes",
        "Contrarian Perspective",
        "Step-by-step Guide",
      ];

      return Array.from({ length: requiredCount }, (_, i) => ({
        title: `Strategy Idea ${i + 1}`,
        hook: "A compelling hook tailored to your goals.",
        angle: angleTemplates[i % angleTemplates.length],
        painPoint: painPointTemplates[i % painPointTemplates.length],
        platform: platformList[i % platformList.length],
        type: typeList[i % typeList.length],
        engagement: "High",
        difficulty: "Medium",
      }));
    }

    // 🔥 REMOVE DUPLICATES
    parsed = parsed.filter(
      (idea, index, self) =>
        index === self.findIndex((i) => i.title === idea.title)
    );

    // ✅ NORMALIZE OUTPUT
    parsed = parsed.map((idea, index) => ({
      title: idea.title?.trim() || `Content Idea ${index + 1}`,
      description: idea.description?.trim() || [
        "Strategic content approach designed to maximize reach and conversion.",
        "High-performance direction focused on building authority and trust.",
        "Creative narrative focused on driving deeper audience connection.",
        "Data-informed strategy aimed at solving core brand challenges.",
        "Actionable roadmap for sustainable growth and platform visibility."
      ][index % 5],
      hook: idea.hook?.trim() || "Engaging hook",
      angle: idea.angle?.trim() || "Creative storytelling",
      painPoint: idea.painPoint?.trim() || "Low engagement",
      platform: idea.platform?.trim() || "Instagram",
      type: idea.type?.trim() || "Short-form Video",
      engagement: ["High", "Medium"].includes(idea.engagement) ? idea.engagement : "High",
      difficulty: ["Easy", "Medium", "Hard"].includes(idea.difficulty) ? idea.difficulty : "Easy",
    }));

    return parsed.slice(0, requiredCount);

  } catch (error) {
    console.error("❌ AI SERVICE ERROR:", error.message);
    const fallbackCount = data?.refinement ? 1 : 10;

    return Array.from({ length: fallbackCount }, (_, i) => ({
      title: `Fallback Idea ${i + 1}`,
      hook: "Create engaging content for your audience",
      angle: "Strategic Perspective",
      painPoint: "Low engagement",
      platform: "Instagram",
      type: "Short-form Video",
      engagement: "High",
      difficulty: "Easy",
    }));
  }
};

module.exports = { generateAIContent };