const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const normalizeWeeklyPlan = (weeklyPlan = []) =>
  Array.isArray(weeklyPlan) ? weeklyPlan.slice(0, 7) : [];

const normalizeText = (value = "") =>
  String(value).replace(/\s+/g, " ").trim();

const formatList = (value, fallback = "") => {
  if (Array.isArray(value) && value.length > 0) return value.join(", ");
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
};

const sanitizeWeeklyPlan = (weeklyPlan = [], selectedIdea = {}, onboardingData = {}) => {
  const usedAngles = new Set();
  const usedWhy = new Set();
  const usedCtas = new Set();
  const usedTimes = new Set();
  const usedResults = new Set();
  const titleSeed = selectedIdea.title || "your topic";
  const brandName = onboardingData.brandName || "";
  const basePainPoint =
    selectedIdea.painPoint ||
    onboardingData.challenges?.frustration ||
    "the audience is not seeing a clear next step";

  return normalizeWeeklyPlan(weeklyPlan).map((item, index) => {
    let angle = normalizeText(item.angle || "");
    let why = normalizeText(item.why || "");

    const fallbackAngles = [
      "Contrarian opener",
      "Step-by-step breakdown",
      "Audience mistake teardown",
      "Story-driven perspective",
      "Behind-the-scenes explanation",
      "Objection-handling post",
      "Direct conversion prompt",
    ];

    const fallbackWhy = [
      `Opens with tension around ${basePainPoint}, so the audience immediately recognizes the problem.`,
      `Makes the idea easier to apply, which increases saves because people can reuse it later.`,
      `Turns a vague topic into a concrete decision, which makes the post feel more actionable.`,
      `Feels specific to the audience's situation, which makes the message more believable and easier to respond to.`,
      `Handles resistance before it appears, which makes the message feel more persuasive.`,
      `Creates comment intent by giving people something specific to agree or disagree with.`,
      `Moves attention toward action with a clearer next step tied to ${titleSeed}.`,
    ];
    const fallbackCtas = [
      "Comment with the part that feels most familiar.",
      "Save this for your next planning session.",
      "Share this with someone who needs a stronger content angle.",
      "Reply with the challenge you want to solve first.",
      "Follow for more premium content strategy breakdowns.",
      "DM me if you want help adapting this idea.",
      "Use this as your next post and tell me what happens.",
    ];
    const fallbackTimes = [
      "8:30 AM",
      "12:15 PM",
      "10:00 AM",
      "7:00 PM",
      "9:15 AM",
      "1:00 PM",
      "6:30 PM",
    ];
    const fallbackResults = [
      "Reach",
      "Saves",
      "Shares",
      "Comments",
      "Follows",
      "DMs",
      "Conversions",
    ];
    let cta = normalizeText(item.cta || item.callToAction || item.action || "");
    let time = normalizeText(item.time || item.bestTime || item.postTime || item.postingTime || "");
    let result = normalizeText(item.result || item.metric || item.kpi || "");

    const genericAngle =
      !angle ||
      usedAngles.has(angle.toLowerCase()) ||
      /^the importance of/i.test(angle) ||
      /^the role of/i.test(angle) ||
      /^how /i.test(angle) ||
      angle.split(" ").length > 8;

    if (genericAngle) {
      angle = fallbackAngles[index % fallbackAngles.length];
    }

    const whyTooSimilar =
      !why ||
      why.toLowerCase() === angle.toLowerCase() ||
      why.toLowerCase().includes(angle.toLowerCase()) ||
      angle.toLowerCase().includes(why.toLowerCase()) ||
      usedWhy.has(why.toLowerCase()) ||
      /real life|builds trust|drives engagement|stops the scroll|difficulty in|struggling with/i.test(why) ||
      /%/.test(why) ||
      (brandName && !why.toLowerCase().includes(brandName.toLowerCase()) && /[A-Z]{2,}/.test(why)) ||
      why.split(" ").length > 22;

    if (whyTooSimilar) {
      why = fallbackWhy[index % fallbackWhy.length];
    }

    const genericCta =
      !cta ||
      cta.length < 12 ||
      /^start the conversation$/i.test(cta) ||
      /^engage with this/i.test(cta) ||
      /^let me know your thoughts$/i.test(cta) ||
      usedCtas.has(cta.toLowerCase());

    if (genericCta) {
      cta = fallbackCtas[index % fallbackCtas.length];
    }

    const genericTime =
      !time ||
      /^8:00\s?(am|pm)$/i.test(time) ||
      usedTimes.has(time.toLowerCase());

    if (genericTime) {
      time = fallbackTimes[index % fallbackTimes.length];
    }

    const genericResult =
      !result ||
      /^engagement$/i.test(result) ||
      /^performance$/i.test(result) ||
      usedResults.has(result.toLowerCase());

    if (genericResult) {
      result = fallbackResults[index % fallbackResults.length];
    }

    usedAngles.add(angle.toLowerCase());
    usedWhy.add(why.toLowerCase());
    usedCtas.add(cta.toLowerCase());
    usedTimes.add(time.toLowerCase());
    usedResults.add(result.toLowerCase());

    return {
      ...item,
      angle,
      why,
      cta,
      time,
      result,
    };
  });
};

const generateWeeklyPlan = async (selectedIdea = {}, onboardingData = {}, options = {}) => {
  try {
    if (!selectedIdea || !onboardingData) {
      throw new Error("Idea and onboarding data are required");
    }

    const tones = onboardingData.voice?.tone || onboardingData.voice?.selectedTones || ["Professional"];
    const goals = onboardingData.goals?.primaryGoal || onboardingData.goals?.selectedGoals || ["Engagement"];
    const audienceType =
      onboardingData.audience?.audienceType ||
      onboardingData.audience?.targetAudience ||
      "your target audience";
    const audienceProfession =
      onboardingData.audience?.profession ||
      onboardingData.audience?.persona ||
      "modern buyers";
    const ageGroup = onboardingData.audience?.ageGroup || "18-34";
    const frustration =
      onboardingData.challenges?.frustration ||
      onboardingData.challenges?.majorPainPoint ||
      "growth consistency";
    const challengeList = formatList(
      onboardingData.challenges?.challenges,
      frustration
    );
    const keywords = formatList(
      onboardingData.keywords?.primary || onboardingData.keywords?.topics,
      selectedIdea.title || "content strategy"
    );
    const platforms = formatList(
      onboardingData.contentType?.platforms,
      selectedIdea.platform || "Instagram"
    );
    const contentTypes = formatList(
      onboardingData.contentType?.contentTypes,
      selectedIdea.type || "Reel"
    );
    const postingFrequency =
      onboardingData.contentType?.postingFrequency || "4 times per week";
    const brandName = onboardingData.brandName || "your brand";
    const industry = onboardingData.industry || "General";
    const contextIdeas = Array.isArray(options.contextIdeas)
      ? options.contextIdeas.slice(0, 10).map((idea) => ({
          title: idea?.title,
          hook: idea?.hook,
          angle: idea?.angle,
          painPoint: idea?.painPoint,
          platform: idea?.platform,
          type: idea?.type,
        }))
      : [];

    const prompt = `
STRICT JSON MODE. Return ONLY a valid JSON object. No intro. No markdown.

You are building a practical, premium 7-day social content plan for ${brandName}.

SELECTED IDEA TO EXPAND:
- Title: ${selectedIdea.title || "Untitled idea"}
- Description: ${selectedIdea.description || "No description provided"}
- Hook: ${selectedIdea.hook || "No hook provided"}
- Angle: ${selectedIdea.angle || "No angle provided"}
- Pain Point: ${selectedIdea.painPoint || frustration}
- Platform: ${selectedIdea.platform || platforms}
- Format: ${selectedIdea.type || contentTypes}

BRAND CONTEXT:
- Industry: ${industry}
- Audience Type: ${audienceType}
- Audience Profession: ${audienceProfession}
- Audience Age: ${ageGroup}
- Brand Tone: ${formatList(tones, "Professional")}
- Main Goals: ${formatList(goals, "Engagement")}
- Challenges: ${challengeList}
- Keywords: ${keywords}
- Preferred Platforms: ${platforms}
- Preferred Content Types: ${contentTypes}
- Posting Frequency: ${postingFrequency}
- Result Source: ${options.sourcePage || "results-page"}

RELATED IDEAS FOR CONTEXT:
${contextIdeas.length > 0 ? JSON.stringify(contextIdeas) : "[]"}

TASK:
Generate a 7-day weekly plan that expands the SELECTED IDEA into a realistic sequence of posts.
11. "angle" and "why" must never say the same thing in different words.
12. Do not use generic "real life", "builds trust", "drives engagement", or "stops the scroll" phrasing unless made highly specific.
13. Every "why" must answer the psychology behind that exact post, not the overall weekly plan.
14. Every day must have a distinct CTA that matches that day's goal. Do not repeat the same CTA across days.
15. Every day must have a realistic posting time, and times should vary across the week. Do not repeat the same time for every day.
16. Every day must have a specific KPI such as Reach, Saves, Shares, Comments, Follows, DMs, Clicks, or Conversions. Do not use "Engagement" for every day.

You must return exactly this structure:
{
  "weeklyPlan": [
    {
      "day": 1,
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
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an elite content strategist who creates realistic 7-day social content plans. You always keep the plan grounded in the selected idea and return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
    });

    let text = response?.choices?.[0]?.message?.content || "";
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);

    if (!parsed.weeklyPlan || !Array.isArray(parsed.weeklyPlan)) {
      throw new Error("Invalid AI response format");
    }

    return {
      selectedIdea,
      contextIdeas,
      weeklyPlan: sanitizeWeeklyPlan(parsed.weeklyPlan, selectedIdea, onboardingData),
    };
  } catch (error) {
    console.error("AI Weekly Plan Error:", error.message);
    return generateFallbackWeeklyPlan(selectedIdea, onboardingData, options);
  }
};

const generateFallbackWeeklyPlan = (selectedIdea = {}, onboardingData = {}, options = {}) => {
  const platform =
    selectedIdea.platform ||
    onboardingData.contentType?.platforms?.[0] ||
    "Instagram";
  const formatOptions =
    onboardingData.contentType?.contentTypes?.length > 0
      ? onboardingData.contentType.contentTypes
      : ["Reel", "Carousel", "Post"];
  const corePainPoint =
    selectedIdea.painPoint ||
    onboardingData.challenges?.frustration ||
    "low consistency";
  const angle = selectedIdea.angle || "Practical education";
  const hook = selectedIdea.hook || `A stronger take on ${selectedIdea.title}`;

  const plan = [
    {
      day: 1,
      goal: "Cold Awareness",
      title: `${selectedIdea.title}: the problem nobody says out loud`,
      hook: hook,
      angle: `${angle} with a bold opener`,
      why: `Starts with the exact pain point your audience already feels: ${corePainPoint}.`,
      format: formatOptions[0] || "Reel",
      cta: "Comment if this sounds familiar.",
      time: "8:30 AM",
      result: "Reach",
    },
    {
      day: 2,
      goal: "Curiosity",
      title: `The biggest mistake behind ${selectedIdea.title}`,
      hook: "Most people think they need more content. They actually need a better angle.",
      angle: "Myth-busting breakdown",
      why: "Creates curiosity by challenging an assumption the audience already believes.",
      format: formatOptions[1] || "Carousel",
      cta: "Save this before your next post.",
      time: "12:30 PM",
      result: "Saves",
    },
    {
      day: 3,
      goal: "Education",
      title: `A simple framework to apply ${selectedIdea.title}`,
      hook: "If you need a cleaner system, start here.",
      angle: "Step-by-step framework",
      why: "Turns the idea into something practical, which increases trust and perceived usefulness.",
      format: formatOptions[2] || "Post",
      cta: "Share this with someone planning content this week.",
      time: "10:00 AM",
      result: "Shares",
    },
    {
      day: 4,
      goal: "Relatability",
      title: `What this looks like in real life`,
      hook: "Here is how this plays out when you're busy, inconsistent, and still trying to grow.",
      angle: "Relatable scenario story",
      why: "Makes the audience feel seen in a specific situation, which increases replies and self-identification.",
      format: formatOptions[0] || "Reel",
      cta: "Reply with the part you relate to most.",
      time: "7:00 PM",
      result: "Comments",
    },
    {
      day: 5,
      goal: "Authority",
      title: `Behind the strategy: why this idea works`,
      hook: "This is the strategic reason this content performs better than generic posting.",
      angle: "Behind-the-scenes strategy",
      why: "Turns your process into evidence, which lowers skepticism and raises perceived expertise.",
      format: formatOptions[1] || "Carousel",
      cta: "Follow for more strategy-led content ideas.",
      time: "9:15 AM",
      result: "Follows",
    },
    {
      day: 6,
      goal: "Intent",
      title: `How to turn attention into action`,
      hook: "Views are nice, but this is how you turn them into real response.",
      angle: "Conversion-focused walkthrough",
      why: "Shifts from awareness into action by giving the audience a next step.",
      format: formatOptions[2] || "Post",
      cta: "DM me if you want help building your version.",
      time: "1:00 PM",
      result: "DMs",
    },
    {
      day: 7,
      goal: "Conversion",
      title: `Your next move after ${selectedIdea.title}`,
      hook: `If ${selectedIdea.title} fits your audience, here is what to do next.`,
      angle: "Direct invitation",
      why: "Closes the week with a clear action while the audience context is still warm.",
      format: formatOptions[0] || "Reel",
      cta: "Book the next step or reach out today.",
      time: "6:30 PM",
      result: "Conversions",
    },
  ];

  return {
    selectedIdea,
    contextIdeas: Array.isArray(options.contextIdeas) ? options.contextIdeas : [],
    weeklyPlan: sanitizeWeeklyPlan(plan, selectedIdea, onboardingData),
  };
};

module.exports = {
  generateWeeklyPlan,
  generateFallbackWeeklyPlan,
};
