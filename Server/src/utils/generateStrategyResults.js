const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "dummy",
  baseURL: process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined,
});

const DEFAULT_MODEL = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : (process.env.OPENAI_MODEL || "gpt-4o-mini");

const toSafeString = (value = "") =>
  value == null ? "" : String(value);

const lower = (value = "") => toSafeString(value).toLowerCase();

const formatList = (value) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => toSafeString(item)).join(", ");
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
};

const normalizeWhitespace = (value = "") =>
  toSafeString(value).replace(/\s+/g, " ").trim();

const toTitleCase = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const normalizeKey = (value = "") =>
  normalizeWhitespace(String(value).toLowerCase()).replace(/[^\w\s]/g, "");

const getPrimaryKeywords = (onboardingData = {}) =>
  onboardingData.keywords?.primary?.length > 0
    ? onboardingData.keywords.primary
    : onboardingData.keywords?.topics || [];

const getPreferredPlatforms = (onboardingData = {}) => {
  const platforms = [
    ...(onboardingData.contentType?.platforms || []),
    ...(onboardingData.audience?.platforms || []),
  ].filter(Boolean);

  const prioritized = platforms.filter(
    (platform) => lower(platform) !== "newsletter"
  );

  return prioritized.length > 0 ? prioritized : platforms;
};

const buildTitle = ({ keyword, brandName, feedback, index, useIndexSuffix }) => {
  const prefixes = [
    "Unlock the Power of",
    "The Ultimate Guide to",
    "Why You Need",
    "How to Master",
    "Essential Tips for",
    "The Truth About",
    "Smarter Ways to Use",
    "Scaling Your Brand with",
    "Avoid This Mistake in",
    "How We Optimize"
  ];
  const prefix = prefixes[index % prefixes.length];

  if (feedback) {
    const shortFeedback = feedback.split(/[.!?]/)[0].slice(0, 48).trim();
    return `${prefix} ${toTitleCase(shortFeedback || keyword)} for ${brandName}${useIndexSuffix ? ` ${index + 1}` : ""}`;
  }

  return `${prefix} ${toTitleCase(keyword)} for ${brandName}${useIndexSuffix ? ` ${index + 1}` : ""}`;
};

const buildHook = ({ feedback, brandName, goals, keyword, index = 0 }) => {
  if (feedback) {
    const sentence = feedback.split(/[.!?]/)[0].trim();
    return normalizeWhitespace(sentence || `A clearer, stronger take on ${keyword} for ${brandName}.`);
  }

  const formattedGoal = lower(formatList(goals) || "growth");
  const hooks = [
    `Ready to master ${lower(keyword)}? Here is how to use it for ${brandName}'s ${formattedGoal}.`,
    `Stop scrolling if you want to scale your brand using smarter ${lower(keyword)}.`,
    `The simple 3-step framework we use at ${brandName} to dominate ${lower(keyword)}.`,
    `Think ${lower(keyword)} is too hard? Here is the secret to driving ${formattedGoal}.`,
    `This one shift in ${lower(keyword)} will transform how you approach ${formattedGoal}.`,
    `Why most creators fail at ${lower(keyword)}, and what ${brandName} does instead.`,
    `If you want to achieve ${formattedGoal}, you need to start doing this with ${lower(keyword)}.`,
  ];

  return hooks[index % hooks.length];
};

const buildAngle = ({ tone, type, industry, platform, selectedMood, index }) => {
  const angles = [
    `A ${lower(tone)} deep-dive into ${lower(type)} dynamics.`,
    `Storytelling-driven ${lower(type)} for ${platform} engagement.`,
    `Educational breakdown of ${lower(industry)} trends.`,
    `A "Behind-the-Scenes" look at ${lower(type)} processes.`,
    `Contrarian take on ${lower(industry)} standards.`,
    `Step-by-step guide for ${platform} users.`,
  ];
  
  const moodMap = {
    Good: "with a premium touch",
    Average: "with optimized delivery",
    Bad: "with a fresh approach",
  };

  const selectedAngle = angles[index % angles.length];
  const moodSuffix = moodMap[selectedMood] ? ` ${moodMap[selectedMood]}` : "";

  return `${selectedAngle}${moodSuffix}`;
};

const buildPainPointVariation = ({
  keyword,
  challenge,
  platform,
  type,
  industry,
  frustration,
  index,
}) => {
  const templates = [
    `${keyword} feels too broad for ${platform}, so the audience never sees a clear next step.`,
    `Most ${lower(industry)} creators post about ${lower(keyword)} without a usable framework people can copy.`,
    `${toSafeString(challenge)} keeps this ${lower(type)} from converting because the message is too vague to act on.`,
    `The audience understands the topic, but not the implementation, which weakens trust and response.`,
    `${lower(frustration)} gets worse when ${lower(keyword)} content sounds generic instead of practical.`,
    `People save content about ${lower(keyword)} only when it solves one concrete workflow problem fast.`,
  ];

  return templates[index % templates.length];
};

const buildDescriptionVariation = ({
  keyword,
  platform,
  type,
  challenge,
  index,
}) => {
  const templates = [
    `${toSafeString(type)} concept turning ${lower(keyword)} into a clearer action plan.`,
    `${toSafeString(platform)} focused idea built to make ${lower(challenge)} easier to solve.`,
    `Specific content angle that makes ${lower(keyword)} more practical and shareable.`,
    `Audience-first idea designed to turn a common blocker into a useful takeaway.`,
    `Clear strategic concept with a stronger real-world use case and easier execution.`,
  ];

  return templates[index % templates.length];
};

const sanitizeResults = (results = {}, onboardingData = {}, options = {}) => {
  const ideaCount = options.ideaCount || 10;
  const brandName = onboardingData.brandName || "Your Brand";
  const industry = onboardingData.industry || "your industry";
  const platforms = getPreferredPlatforms(onboardingData);
  const contentTypes = onboardingData.contentType?.contentTypes || [];
  const challenges = onboardingData.challenges?.challenges || [];
  const keywords = getPrimaryKeywords(onboardingData);
  const tones = onboardingData.voice?.tone || [];
  const frustration =
    onboardingData.challenges?.frustration || "low consistency and low engagement";

  // Pre-seed with existing titles so "Generate More" never repeats a title
  // from the previous batch.
  const excludeTitles = Array.isArray(options.excludeTitles) ? options.excludeTitles : [];
  const seenTitles = new Set(excludeTitles.map(normalizeKey));
  const painPointStarts = new Set();
  const angleCounts = new Map();
  const descriptionKeys = new Set();
  const seenHookStarts = new Set(); // track hook openings

  const ideas = (Array.isArray(results.ideas) ? results.ideas : [])
    .slice(0, ideaCount)
    .map((idea, index) => {
      const keyword =
        keywords[index % Math.max(keywords.length, 1)] || `Content Theme ${index + 1}`;
      const platform =
        idea.platform ||
        platforms[index % Math.max(platforms.length, 1)] ||
        "Instagram";
      const type =
        idea.type ||
        contentTypes[index % Math.max(contentTypes.length, 1)] ||
        "Reel";
      const challenge =
        challenges[index % Math.max(challenges.length, 1)] || "Low engagement";
      const tone = tones[index % Math.max(tones.length, 1)] || "Strategic";

      let title = normalizeWhitespace(idea.title || buildTitle({ keyword, brandName, index }));
      const titleKeyBase = normalizeKey(title);
      let titleKey = titleKeyBase;
      let duplicateIndex = 2;
      while (seenTitles.has(titleKey)) {
        title = `${title.replace(/\s+\d+$/, "")} ${duplicateIndex}`;
        titleKey = normalizeKey(title);
        duplicateIndex += 1;
      }
      seenTitles.add(titleKey);

      let angle = normalizeWhitespace(idea.angle || "");
      const angleKey = normalizeKey(angle);
      const angleCount = angleCounts.get(angleKey) || 0;
      if (!angle || angleCount >= 2) {
        angle = buildAngle({
          tone,
          type,
          industry,
          platform,
          selectedMood: "",
          index,
        });
      }
      angleCounts.set(normalizeKey(angle), (angleCounts.get(normalizeKey(angle)) || 0) + 1);

      let painPoint = normalizeWhitespace(idea.painPoint || "");
      const painStart = normalizeKey(painPoint).split(" ").slice(0, 2).join(" ");
      const isGenericPainPoint =
        !painPoint ||
        painPoint.length < 28 ||
        painPoint.startsWith("Difficulty in") ||
        painPoint.startsWith("Struggling with") ||
        painPoint.startsWith("Difficulty with") ||
        painPointStarts.has(painStart);

      if (isGenericPainPoint) {
        painPoint = buildPainPointVariation({
          keyword,
          challenge,
          platform,
          type,
          industry,
          frustration,
          index,
        });
      }
      painPointStarts.add(normalizeKey(painPoint).split(" ").slice(0, 2).join(" "));

      let description = normalizeWhitespace(idea.description || "");
      const descriptionKey = normalizeKey(description);
      if (!description || descriptionKeys.has(descriptionKey)) {
        description = buildDescriptionVariation({
          keyword,
          platform,
          type,
          challenge,
          index,
        });
      }
      descriptionKeys.add(normalizeKey(description));

      // ── HOOK deduplication (NEW) ────────────────────────────────────────────
      let hook = normalizeWhitespace(idea.hook || "");
      // Extract first 5 words to detect duplicate patterns like "Use X to help Y..."
      const hookStart = normalizeKey(hook).split(" ").slice(0, 5).join(" ");
      const isRepetitiveHook =
        !hook ||
        hook.length < 20 ||
        seenHookStarts.has(hookStart) ||
        // Catch common AI-generated repetitive templates
        /^use .+ to help/i.test(hook) ||
        /^use .+ interview to help/i.test(hook);

      if (isRepetitiveHook) {
        hook = buildHook({
          brandName,
          goals: onboardingData.goals?.primaryGoal || [],
          keyword,
          index,
        });
      }
      seenHookStarts.add(normalizeKey(hook).split(" ").slice(0, 5).join(" "));
      // ────────────────────────────────────────────────────────────────────────

      return {
        ...idea,
        title,
        description,
        hook,
        angle,
        painPoint,
        platform,
        type,
        engagement: idea.engagement || "High Engagement",
        difficulty: idea.difficulty || (index % 2 === 0 ? "Easy" : "Medium"),
      };
    });

  return {
    ...results,
    ideas,
  };
};


const safeFinalizeResults = (results = {}, onboardingData = {}, options = {}) => {
  try {
    return sanitizeResults(results, onboardingData, options);
  } catch (error) {
    console.error("Result sanitization fallback:", error.message);
    try {
      return buildFallbackResults(onboardingData, options);
    } catch (fallbackError) {
      console.error("Fallback build failure:", fallbackError.message);
      return {
        summary: {
          brandGoal: "Increase Engagement",
          audience: "General Audience",
          postingFrequency: "4 Times / Week",
          contentType: "Short-form Content",
        },
        ideas: Array.from({ length: options.ideaCount || 10 }, (_, index) => ({
          id: index + 1,
          title: `Content Idea ${index + 1}`,
          description: "Clear content direction designed to drive stronger engagement.",
          hook: "A useful hook tailored to your audience.",
          angle: "Strategic breakdown",
          painPoint: "The audience needs a clearer, more practical next step.",
          platform: "Instagram",
          type: "Reel",
          engagement: "High Engagement",
          difficulty: "Easy",
        })),
        meta: {
          source: "emergency-fallback",
        },
      };
    }
  }
};

const buildFallbackResults = (onboardingData = {}, options = {}) => {
  const ideaCount = options.ideaCount || 10;
  const excludeTitles = options.excludeTitles || [];
  const feedback = options.feedback || "";
  const selectedMood = options.selectedMood || "";
  const brandName = onboardingData.brandName || "Your Brand";
  const industry = formatList(onboardingData.industry) || "your industry";
  const goals = onboardingData.goals?.primaryGoal || [];
  const platforms = getPreferredPlatforms(onboardingData);
  const contentTypes = onboardingData.contentType?.contentTypes || [];
  const challenges = onboardingData.challenges?.challenges || [];
  const keywords =
    onboardingData.keywords?.primary?.length > 0
      ? onboardingData.keywords.primary
      : onboardingData.keywords?.topics || [];
  const tones = onboardingData.voice?.tone || [];
  const frustration =
    onboardingData.challenges?.frustration ||
    "Low consistency and low engagement.";

  const summary = {
    brandGoal: formatList(goals) || "Increase Engagement",
    audience:
      [
        onboardingData.audience?.profession,
        onboardingData.audience?.audienceType,
        onboardingData.audience?.ageGroup,
      ]
        .filter(Boolean)
        .join(" • ") || "Students & Creators",
    postingFrequency:
      onboardingData.contentType?.postingFrequency || "4 Times / Week",
    contentType: formatList(contentTypes) || "Reels + Carousel",
  };

  const ideas = Array.from({ length: ideaCount }, (_, index) => {
    const keyword =
      keywords[index % Math.max(keywords.length, 1)] ||
      `Content Theme ${index + 1}`;
    const platform =
      platforms[index % Math.max(platforms.length, 1)] ||
      (index % 2 === 0 ? "Instagram" : "LinkedIn");
    const type =
      contentTypes[index % Math.max(contentTypes.length, 1)] ||
      (index % 3 === 0 ? "Reel" : index % 3 === 1 ? "Carousel" : "Post");
    const challenge =
      challenges[index % Math.max(challenges.length, 1)] || "Low Engagement";
    const tone =
      tones[index % Math.max(tones.length, 1)] || "Strategic";

    const feedbackText = feedback.trim();
    const moodText = selectedMood.trim();

    const painPointTemplates = [
      `Solving the struggle of ${lower(challenge)} through smarter ${lower(keyword)}.`,
      `The hidden reason why ${lower(keyword)} fails and how to fix it.`,
      `Overcoming ${lower(frustration)} by mastering ${lower(keyword)}.`,
      `Stopping the cycle of ${lower(challenge)} with a new ${lower(type)} strategy.`,
      `Why ${lower(industry)} audiences ignore ${lower(keyword)} (and how to win them back).`,
    ];

    return {
      id: index + 1,
      title: buildTitle({
        keyword,
        brandName,
        feedback: feedbackText,
        index,
        useIndexSuffix: excludeTitles.length > 0,
      }),
      hook: buildHook({
        feedback: feedbackText,
        brandName,
        goals,
        keyword,
        index,
      }),
      angle: buildAngle({
        tone,
        type,
        industry,
        platform,
        selectedMood: moodText,
        index,
      }),
      description: [
        `Strategic approach to ${lower(keyword)} for your ${lower(industry)} brand.`,
        `High-performance ${lower(type)} strategy focused on growth.`,
        `Creative direction designed to boost ${platform} engagement.`,
        `Data-driven ${lower(keyword)} roadmap for authority building.`,
        `Optimized content plan focused on solving ${lower(challenge)}.`,
      ][index % 5],
      painPoint: painPointTemplates[index % painPointTemplates.length],
      platform,
      type,
      engagement: index % 2 === 0 ? "High Engagement" : "Trending",
      difficulty: index % 2 === 0 ? "Easy" : "Medium",
    };
  });

  return {
    summary,
    ideas,
    meta: {
      source: "fallback",
    },
  };
};

const extractResponseText = (responseData) => {
  if (typeof responseData?.output_text === "string" && responseData.output_text.trim()) {
    return responseData.output_text;
  }

  const output = Array.isArray(responseData?.output) ? responseData.output : [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }

  return "";
};

const generateStrategyResults = async (onboardingData = {}, options = {}) => {
  const ideaCount = options.ideaCount || 10;
  const excludeTitles = Array.isArray(options.excludeTitles)
    ? options.excludeTitles.filter(Boolean)
    : [];
  const feedback = typeof options.feedback === "string" ? options.feedback.trim() : "";
  const selectedMood =
    typeof options.selectedMood === "string" ? options.selectedMood.trim() : "";
  const currentIdeas = Array.isArray(options.currentIdeas)
    ? options.currentIdeas.slice(0, 10)
    : [];

  const hasApiKey = !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);

  if (!hasApiKey) {
    return safeFinalizeResults(buildFallbackResults(onboardingData, {
      ideaCount,
      excludeTitles,
      feedback,
      selectedMood,
    }), onboardingData, {
      ideaCount,
      excludeTitles,
      feedback,
      selectedMood,
      currentIdeas,
    });
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["summary", "ideas"],
    properties: {
      summary: {
        type: "object",
        additionalProperties: false,
        required: ["brandGoal", "audience", "postingFrequency", "contentType"],
        properties: {
          brandGoal: { type: "string" },
          audience: { type: "string" },
          postingFrequency: { type: "string" },
          contentType: { type: "string" },
        },
      },
      ideas: {
        type: "array",
        minItems: ideaCount,
        maxItems: ideaCount,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "title",
            "description",
            "hook",
            "angle",
            "painPoint",
            "platform",
            "type",
            "engagement",
            "difficulty",
          ],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            hook: { type: "string" },
            angle: { type: "string" },
            painPoint: { type: "string" },
            platform: { type: "string" },
            type: { type: "string" },
            engagement: { type: "string" },
            difficulty: { type: "string" },
          },
        },
      },
    },
  };

  const prompt = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text:
            "You generate concise, high-quality content strategy summaries and content idea cards for brands. \n\nRULES:\n1. ONLY use platforms/formats from onboarding data.\n2. Each idea card MUST have a unique, hyper-specific 'painPoint' that explains a specific obstacle for THAT title. DO NOT repeat the brand's global frustration or keywords word-for-word on every card. Variety is mandatory.\n3. Each idea MUST have a distinct 'angle' (e.g., educational breakdown, storytelling, myth-busting, etc.). DO NOT use the same angle for more than 2 ideas in the batch.\n4. Do NOT start multiple painPoint fields with the same opening phrase like 'Difficulty in', 'Struggling with', or 'How to'.\n5. Each idea card MUST have a unique, scroll-stopping 'hook' tailored to the topic. Do NOT repeat the same hook sentence structure or pattern across cards.\n6. Return only JSON matching the schema.",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Create a personalized content strategy summary and exactly ${ideaCount} idea cards from this onboarding data: ${JSON.stringify(
            onboardingData
          )}. \n\nCRITICAL CONSTRAINTS:\n1. ONLY use these platforms: ${getPreferredPlatforms(onboardingData).join(", ")}\n2. ONLY use these content formats: ${formatList(onboardingData.contentType?.contentTypes || [])}\n\n${
            excludeTitles.length > 0
              ? `Do not repeat or closely paraphrase these existing idea titles: ${excludeTitles.join(
                  " | "
                )}. Make the new ideas clearly different.`
              : ""
          } ${feedback ? `Use this user refinement feedback strongly in the output: ${feedback}.` : ""} ${
            selectedMood ? `The user's satisfaction mood is: ${selectedMood}.` : ""
          } ${
            currentIdeas.length > 0
              ? `Current ideas for context: ${JSON.stringify(currentIdeas)}.`
              : ""
          }`,
        },
      ],
    },
  ];

  try {
    let parsed;
    if (process.env.GROQ_API_KEY) {
      // Prompt construction for standard JSON Mode (supported by Groq Llama)
      const userPrompt = `${prompt[1].content[0].text}\n\nYou must conform your response strictly to the following JSON Schema: \n${JSON.stringify(schema, null, 2)}`;
      
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: prompt[0].content[0].text },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      const rawText = response.choices[0].message.content;
      parsed = JSON.parse(rawText);
    } else {
      // Standard OpenAI strict JSON Schema formatting
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: prompt,
        temperature: 0.7,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "content_strategy_results",
            strict: true,
            schema,
          }
        }
      });
      const rawText = response.choices[0].message.content;
      parsed = JSON.parse(rawText);
    }

    return safeFinalizeResults({
      ...parsed,
      meta: {
        source: process.env.GROQ_API_KEY ? "groq" : "openai",
        model: DEFAULT_MODEL,
      },
    }, onboardingData, {
      ideaCount,
      excludeTitles,
      feedback,
      selectedMood,
      currentIdeas,
    });
  } catch (error) {
    console.error("Result generation fallback:", error.message);
    return safeFinalizeResults(buildFallbackResults(onboardingData, {
      ideaCount,
      excludeTitles,
      feedback,
      selectedMood,
    }), onboardingData, {
      ideaCount,
      excludeTitles,
      feedback,
      selectedMood,
      currentIdeas,
    });
  }
};

module.exports = {
  buildFallbackResults,
  generateStrategyResults,
};
