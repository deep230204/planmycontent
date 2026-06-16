const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Enhances a content idea using expert strategist logic.
 */
const enhanceIdea = async (idea = {}, onboardingData = {}) => {
  try {
    const originalTitle = idea.title || "Generic Post";
    const cleanTitle = originalTitle.replace(/\s+\d+$/, "").trim();

    const { title, platform, audience, goals, tone } = {
      title: cleanTitle,
      platform: idea.platform || "Instagram",
      audience: onboardingData.audience?.profession || onboardingData.audience?.targetAudience || "General Audience",
      goals: Array.isArray(onboardingData.goals?.primaryGoal) ? onboardingData.goals.primaryGoal.join(", ") : "Growth",
      tone: Array.isArray(onboardingData.voice?.tone) ? onboardingData.voice.tone.join(", ") : "Professional",
    };

    const prompt = `
You are an expert content strategist optimizing saved content ideas.
Your job is to refine and enhance each saved idea so it feels high-value, actionable, and unique — while keeping the original concept intact.

---

## 🎯 INPUT

* Original Idea Title: ${title}
* Platform: ${platform}
* Audience: ${audience}
* Goals: ${goals}
* Tone: ${tone}

---

## 🚫 HARD RULES

1. Do NOT make the title generic or boring.
2. Avoid phrases like:
   * "Transform your body"
   * "Top tips"
   * "Beginner guide"
   * "Secrets to success"
3. Do NOT repeat wording from other ideas.
4. Keep it short, clear, and scroll-stopping.
5. Do NOT start painPoint with repetitive phrases like "Difficulty in", "Struggling with", "Lack of", or "How to". Start directly with the friction or problem (e.g. "Manual scheduling eats up hours", "Audience ignores posts without clear actions").

---

## 🔥 ENHANCEMENT RULES

For each saved idea:

### 1. Title Upgrade
Rewrite the title to be:
* More curiosity-driven
* More specific
* More engaging

Example:
❌ "Fat Loss Workouts"
✅ "No Time for the Gym? Try This 5-Minute Routine"

---

### 2. Hook (MANDATORY)
Write a strong opening line that:
* Creates curiosity OR
* Calls out a pain point OR
* Makes the user stop scrolling

---

### 3. Angle
Clearly define:
* What makes this idea unique
* Why it's different from normal content

---

### 4. Pain Point
Identify:
* The exact problem this solves

---

### 5. Category
Classify into one:
* Educational
* Relatable
* Contrarian
* Story

---

### 6. Viral Score (0–100)
Score based on:
* Hook strength
* Uniqueness
* Emotional pull
* Audience relevance

---

### 7. Difficulty
Estimate:
* Easy / Medium / Hard

---

## ⚡ OUTPUT FORMAT (STRICT JSON)

{
"title": "",
"hook": "",
"angle": "",
"painPoint": "",
"category": "",
"viralScore": 0,
"difficulty": ""
}

---

## 🚀 FINAL CHECK
Before returning:
* Ensure title is NOT generic
* Ensure hook is engaging
* Ensure idea feels worth saving and using
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert content strategist. Return JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    let text = response?.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text);

    return {
      ...idea,
      ...parsed,
      originalTitle: title,
      isEnhanced: true
    };

  } catch (error) {
    console.error("❌ ENHANCE IDEA ERROR:", error.message);
    return idea;
  }
};

module.exports = { enhanceIdea };
