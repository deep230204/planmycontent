const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Refines a single day of a content plan based on user feedback.
 */
const refineDayPlan = async (dayData = {}, feedback = "", onboardingData = {}, fullPlan = []) => {
  try {
    if (!dayData || !feedback) {
      throw new Error("Day data and feedback are required for refinement");
    }

    const brandName = onboardingData?.brandName || "the brand";
    const industry = onboardingData?.industry || "the industry";
    const tones = onboardingData?.voice?.selectedTones?.join(", ") || "Professional";

    const otherDaysContext = fullPlan
      .filter((d) => d.day !== dayData.day)
      .map((d) => `Day ${d.day}: ${d.title}`)
      .join("\n");

    const prompt = `
You are an elite, edgy Social Media Ghostwriter. Refine Day ${dayData.day || 1} of a 7-day roadmap.
Brand: ${brandName}
Industry: ${industry}
Target Audience: ${onboardingData?.audience?.targetAudience || "General"}
Brand Voice: ${tones}

USER FEEDBACK: "${feedback}"

STRATEGIC CONTEXT:
- Current version of this day: "${dayData.title}" (Angle: ${dayData.angle})
- Other days in the plan (DO NOT REPEAT THESE):
${otherDaysContext}

TASK: Regenerate Day ${dayData.day || 1}. 
CRITICAL NEGATIVE RULES:
1. NO corporate jargon. DO NOT use words like "Unleash", "Maximize", "Elevate", "Synergy", "Innovative", or "Crafting".
2. Write like a human speaking to another human.
3. Make the "why" concrete and psychological, not a generic statement about trust or engagement.
4. DO NOT change the JSON keys. You must use exactly "goal", "title", "hook", "angle", "why", "format", "cta", "time", "result".

Return ONLY a JSON object:
{
  "refinedDay": {
    "day": ${dayData.day || 1},
    "goal": "...",
    "title": "...",
    "hook": "...",
    "angle": "...",
    "why": "...",
    "format": "...",
    "cta": "...",
    "time": "...",
    "result": "..."
  }
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an elite content strategist who hates corporate jargon. Return JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    let text = response?.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text);

    return parsed.refinedDay || dayData;

  } catch (error) {
    console.error("❌ REFINE UTILITY ERROR:", error.message);
    return dayData;
  }
};

module.exports = { refineDayPlan };
