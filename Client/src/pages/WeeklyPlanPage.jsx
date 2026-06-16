import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Bookmark,
  Megaphone,
  AlertCircle,
  Heart,
  Shield,
  MessageCircle,
  GraduationCap,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  Target,
  Brain,
  Rocket,
  Award,
  Eye,
  Compass,
  Coffee,
  CalendarDays,
  Sparkles,
  Layout,
  MessageSquare,
  Wand2,
  Clock3,
  BarChart3,
  Layers3,
  Hash,
} from "lucide-react";
import { savePlan, saveContent } from "../services/dashboardService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import axios from "axios";
import {
  GENERATED_RESULTS_KEY,
  MORE_RESULTS_KEY,
  REFINED_RESULTS_KEY,
  readIdeasPayload,
} from "../utils/resultStorage";
import { useTheme } from "../context/ThemeContext";

const normalizeWeeklyPlan = (rawPlan) =>
  Array.isArray(rawPlan) ? rawPlan.slice(0, 7) : [];

const normalizeText = (value = "") =>
  String(value).replace(/\s+/g, " ").trim();

const getArticle = (value = "") => {
  const first = String(value).trim().charAt(0).toLowerCase();
  return ["a", "e", "i", "o", "u"].includes(first) ? "an" : "a";
};

const formatDisplayList = (value = "") => {
  const normalized = String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  if (normalized.length === 0) return String(value || "").trim();
  if (normalized.length === 1) return normalized[0];
  if (normalized.length === 2) return `${normalized[0]} and ${normalized[1]}`;
  return `${normalized.slice(0, -1).join(", ")}, and ${normalized[normalized.length - 1]}`;
};

const sanitizePlanEntries = (rawPlan = [], selectedIdea = {}, onboarding = {}) => {
  const usedAngles = new Set();
  const usedWhy = new Set();
  const usedCtas = new Set();
  const usedTimes = new Set();
  const usedResults = new Set();
  const fallbackGoals = [
    "Cold Awareness",
    "Curiosity",
    "Education",
    "Relatability",
    "Authority",
    "Intent",
    "Conversion",
  ];
  const fallbackAngles = [
    "Contrarian opener",
    "Step-by-step breakdown",
    "Audience mistake teardown",
    "Story-led perspective",
    "Behind-the-scenes strategy",
    "Objection-handling post",
    "Direct conversion prompt",
  ];
  const corePain =
    selectedIdea.painPoint ||
    onboarding.challenges?.frustration ||
    "the audience is not seeing a clear next step";
  const titleSeed = selectedIdea.title || "this topic";
  const fallbackWhy = [
    `It names the tension around ${corePain}, so the audience immediately recognizes the problem.`,
    "It makes the topic easier to apply, which increases saves from people who want to revisit it later.",
    "It turns a vague idea into a usable next step, which makes the post feel practical instead of abstract.",
    "It feels specific to the audience's situation, which increases replies and personal connection.",
    "It shows a process instead of a promise, which raises credibility and lowers skepticism.",
    "It gives the audience a clearer action path, which improves intent and response quality.",
    `It closes the loop around ${titleSeed}, making the final CTA feel earned instead of abrupt.`,
  ];
  const fallbackCtas = [
    "Comment with the part that feels most familiar.",
    "Save this so you can use it before your next post.",
    "Share this with a teammate who needs a clearer plan.",
    "Reply with the obstacle you want to fix first.",
    "Follow for more strategy-led content breakdowns.",
    "DM me if you want help adapting this for your brand.",
    "Use this as your next post and tell me how it performs.",
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

  return normalizeWeeklyPlan(rawPlan).map((item, index) => {
    let goal = normalizeText(item.goal || "");
    let angle = normalizeText(item.angle || "");
    let why = normalizeText(item.why || item.reason || item.strategy || "");
    let cta = normalizeText(item.cta || item.callToAction || item.action || "");
    let time = normalizeText(item.time || item.bestTime || item.postTime || item.postingTime || "");
    let result = normalizeText(item.result || item.metric || item.kpi || "");
    const title = normalizeText(item.title || `${titleSeed} content idea`);
    const hook = normalizeText(item.hook || `Here is a stronger way to approach ${titleSeed}.`);

    if (!goal || goal.length < 4) {
      goal = fallbackGoals[index % fallbackGoals.length];
    }

    const genericAngle =
      !angle ||
      angle.length < 8 ||
      /^the importance of/i.test(angle) ||
      /^the role of/i.test(angle) ||
      /^how to/i.test(angle) ||
      /^why /i.test(angle) ||
      angle.split(" ").length > 8 ||
      usedAngles.has(angle.toLowerCase());

    if (genericAngle) {
      angle = fallbackAngles[index % fallbackAngles.length];
    }

    const badWhy =
      !why ||
      why.length < 18 ||
      why.toLowerCase() === angle.toLowerCase() ||
      why.toLowerCase().includes(angle.toLowerCase()) ||
      /^difficulty in/i.test(why) ||
      /^struggling with/i.test(why) ||
      /^the importance of/i.test(why) ||
      /^the role of/i.test(why) ||
      /%/.test(why) ||
      /[A-Z]{2,}/.test(why) ||
      why.split(" ").length > 22 ||
      usedWhy.has(why.toLowerCase());

    if (badWhy) {
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
      day: item.day || index + 1,
      goal,
      title,
      hook,
      angle,
      why,
      cta,
      time,
      result,
      format: normalizeText(item.format || selectedIdea.type || "Post"),
    };
  });
};

const WEEKLY_PLAN_STORAGE_KEY = "latestWeeklyPlan";
const WEEKLY_PLAN_CONTEXT_KEY = "latestWeeklyPlanContext";
const WEEKLY_PLAN_STORAGE_VERSION = 2;

const readStoredWeeklyPlan = (ideaTitle = "") => {
  const raw = JSON.parse(localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY) || "null");

  if (
    raw &&
    raw.version === WEEKLY_PLAN_STORAGE_VERSION &&
    Array.isArray(raw.weeklyPlan) &&
    (!ideaTitle || !raw.ideaTitle || raw.ideaTitle === ideaTitle)
  ) {
    return normalizeWeeklyPlan(raw.weeklyPlan);
  }

  return null;
};

const writeStoredWeeklyPlan = (ideaTitle, weeklyPlan) => {
  localStorage.setItem(
    WEEKLY_PLAN_STORAGE_KEY,
    JSON.stringify({
      version: WEEKLY_PLAN_STORAGE_VERSION,
      ideaTitle: ideaTitle || "",
      weeklyPlan: normalizeWeeklyPlan(weeklyPlan),
      savedAt: new Date().toISOString(),
    })
  );
};

const writeStoredPlanContext = (payload = {}) => {
  localStorage.setItem(WEEKLY_PLAN_CONTEXT_KEY, JSON.stringify(payload));
};

const readStoredPlanContext = () =>
  JSON.parse(localStorage.getItem(WEEKLY_PLAN_CONTEXT_KEY) || "null");

const getGoalIcon = (goal = "", day = 1) => {
  const g = goal.toLowerCase();
  if (g.includes("awareness") || g.includes("reach")) {
    return {
      Icon: Megaphone,
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)",
    };
  }
  if (g.includes("problem") || g.includes("solve") || g.includes("pain")) {
    return {
      Icon: AlertCircle,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.2)",
    };
  }
  if (g.includes("education") || g.includes("teach") || g.includes("how")) {
    return {
      Icon: GraduationCap,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.2)",
    };
  }
  if (g.includes("authority") || g.includes("expert") || g.includes("trust")) {
    return {
      Icon: Shield,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.2)",
    };
  }
  if (g.includes("engagement") || g.includes("ask") || g.includes("community")) {
    return {
      Icon: MessageCircle,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
    };
  }
  if (g.includes("relatable") || g.includes("story") || g.includes("personal")) {
    return {
      Icon: Heart,
      color: "#ec4899",
      bg: "rgba(236,72,153,0.1)",
      border: "rgba(236,72,153,0.2)",
    };
  }
  if (g.includes("sell") || g.includes("offer") || g.includes("conversion")) {
    return {
      Icon: ShoppingBag,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    };
  }

  const extras = [Rocket, Brain, Target, Award, Eye, Compass, Coffee];
  const colors = [
    "#f43f5e",
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f97316",
    "#0ea5e9",
    "#fbbf24",
  ];
  return {
    Icon: extras[(day - 1) % extras.length],
    color: colors[(day - 1) % colors.length],
    bg: "var(--soft-bg)",
    border: "var(--app-border)",
  };
};

export default function WeeklyPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [aiPlan, setAiPlan] = useState([]);
  const [savedOk, setSavedOk] = useState(false);
  const [copiedDay, setCopiedDay] = useState(null);
  const [savedDays, setSavedDays] = useState(new Set());
  const [refiningDay, setRefiningDay] = useState(null);
  const [refinementFeedback, setRefinementFeedback] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const handleRefineDay = async (index) => {
    if (!refinementFeedback.trim()) return;
    setIsRefining(true);
    const loadingToast = toast.loading(`Refining Day ${index + 1}...`);
    const stripIcons = (item) => {
      const { Icon, ...rest } = item;
      return rest;
    };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/refine-day", {
        dayData: stripIcons(plan[index]),
        feedback: refinementFeedback,
        onboardingData: onboarding,
        fullPlan: plan.map(stripIcons)
      });
      if (response.data.success) {
        const updatedPlan = [...plan];
        updatedPlan[index] = {
           ...response.data.refinedDay,
           Icon: plan[index].Icon,
           color: plan[index].color,
           day: plan[index].day // Ensure day number doesn't change
        };
        setAiPlan(updatedPlan);
        setRefiningDay(null);
        setRefinementFeedback("");
        toast.success(`Day ${index + 1} refined successfully!`, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Refinement failed. Please try again.", { id: loadingToast });
    } finally {
      setIsRefining(false);
    }
  };

  const idea = useMemo(() => {
    const rawState = location.state?.selectedIdea || location.state?.idea || location.state;
    if (rawState && Object.keys(rawState).length > 0) {
      const extracted = rawState.selectedIdea || rawState;
      if (extracted.title) {
        localStorage.setItem("latestSelectedIdea", JSON.stringify(extracted));
        return extracted;
      }
    }

    const storedIdea = JSON.parse(
      localStorage.getItem("latestSelectedIdea") || "null"
    );
    if (storedIdea && storedIdea.title) return storedIdea;

    // Fallback to first idea from generated results if available
    const ideas = readIdeasPayload(GENERATED_RESULTS_KEY)?.ideas || [];
    if (ideas.length > 0) {
      return ideas[0];
    }

    return {};
  }, [location.state]);
  const onboarding = useMemo(
    () =>
      location.state?.onboardingData ||
      JSON.parse(localStorage.getItem("latestOnboardingData") || "{}"),
    [location.state]
  );
  const cachedPlan = useMemo(() => readStoredWeeklyPlan(idea.title), [idea.title]);
  const sourceResults = useMemo(() => {
    const stateResults = location.state?.sourceResults;
    if (Array.isArray(stateResults) && stateResults.length > 0) {
      writeStoredPlanContext({
        ideaTitle: idea.title || "",
        sourceResults: stateResults,
        sourcePage: location.state?.sourcePage || "",
      });
      return stateResults;
    }

    const storedContext = readStoredPlanContext();
    if (
      storedContext &&
      Array.isArray(storedContext.sourceResults) &&
      (!idea.title || !storedContext.ideaTitle || storedContext.ideaTitle === idea.title)
    ) {
      return storedContext.sourceResults;
    }

    const refined = readIdeasPayload(REFINED_RESULTS_KEY);
    if (Array.isArray(refined?.ideas) && refined.ideas.length > 0) return refined.ideas;

    const more = readIdeasPayload(MORE_RESULTS_KEY);
    if (Array.isArray(more?.ideas) && more.ideas.length > 0) return more.ideas;

    const main = readIdeasPayload(GENERATED_RESULTS_KEY);
    if (Array.isArray(main?.ideas) && main.ideas.length > 0) return main.ideas;

    return [];
  }, [idea.title, location.state]);

  const sourcePage = useMemo(() => {
    const statePage = location.state?.sourcePage;
    if (statePage) return statePage;
    const storedContext = readStoredPlanContext();
    return storedContext?.sourcePage || "results";
  }, [location.state]);
  const existingPlan = useMemo(
    () => location.state?.plan || cachedPlan,
    [cachedPlan, location.state]
  );
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );

  useEffect(() => {
    const fetchPlan = async () => {
      if (Array.isArray(existingPlan) && existingPlan.length > 0) {
        const normalizedPlan = sanitizePlanEntries(existingPlan, idea, onboarding);
        setAiPlan(normalizedPlan);
        setLoading(false);
        if (location.state?.plan) {
          writeStoredWeeklyPlan(idea.title, normalizedPlan);
        }
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/auth/generate-weekly-plan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              selectedIdea: idea,
              onboardingData: onboarding,
              contextIdeas: sourceResults,
              sourcePage,
            }),
          }
        );
        const data = await res.json();
        if (data.success) {
          const normalizedPlan = sanitizePlanEntries(
            data.result.weeklyPlan,
            idea,
            onboarding
          );
          setAiPlan(normalizedPlan);
          writeStoredWeeklyPlan(idea.title, normalizedPlan);
        }
      } catch (error) {
        toast.error("Error fetching AI plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [existingPlan, idea, onboarding, sourceResults, sourcePage]);

  const plan = useMemo(
    () =>
      aiPlan.map((d, i) => {
        const { Icon, color, bg, border } = getGoalIcon(d.goal, i + 1);
        return {
          ...d,
          Icon,
          color,
          bg,
          border,
          day: d.day || i + 1,
          platform:
            idea.platform ||
            onboarding.contentType?.platforms?.[0] ||
            "Instagram",
        };
      }),
    [aiPlan, idea.platform, onboarding.contentType?.platforms]
  );

  const strategySnapshot = useMemo(
    () => [
      {
        label: "Selected Platform",
        value:
          idea.platform ||
          onboarding.contentType?.platforms?.[0] ||
          "Instagram",
        Icon: Layers3,
        tone: "text-orange-400",
        style: { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }
      },
      {
        label: "Primary Format",
        value:
          idea.type ||
          onboarding.contentType?.contentTypes?.[0] ||
          "Reel",
        Icon: Layout,
        tone: "text-blue-400",
        style: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }
      },
      {
        label: "Core Keyword",
        value:
          onboarding.keywords?.primary?.[0] ||
          onboarding.keywords?.topics?.[0] ||
          "Content Strategy",
        Icon: Hash,
        tone: "text-emerald-400",
        style: { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }
      },
      {
        label: "Weekly KPI",
        value: plan[plan.length - 1]?.result || "Conversions",
        Icon: BarChart3,
        tone: "text-purple-400",
        style: { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }
      },
    ],
    [idea.platform, idea.type, onboarding, plan]
  );

  const handleSaveWholePlan = async () => {
    if (!user) return toast.error("Please login first");
    try {
      const res = await savePlan(user._id || user.id, {
        title: idea.title,
        plan,
        selectedIdea: idea,
        onboardingData: onboarding,
      });

      if (res.success) {
        const savedPlanId = res.plan?._id;
        await Promise.all(
          plan.map((d) =>
            saveContent(user._id || user.id, {
              title: d.title,
              body: `Hook: ${d.hook}\n\nAngle: ${d.angle}\n\nWhy: ${d.why || d.reason || d.strategy || d.painPoint || "Builds audience trust."}`,
              source: "plan",
              dayNumber: d.day,
              planId: savedPlanId,
              status: "saved",
              platform: d.platform,
              format: d.format,
              goal: d.goal,
            })
          )
        );
        setSavedDays(new Set(plan.map((_, index) => index)));
        setSavedOk(true);
        toast.success("Full content plan saved, and all days added to My Content!");
        setTimeout(() => setSavedOk(false), 3000);
      }
    } catch {
      toast.error("Error saving plan");
    }
  };

  const handleSaveSingleDay = async (d, index) => {
    if (!user) return toast.error("Please login first");
    try {
      const res = await saveContent(user._id || user.id, {
        title: d.title,
        body: `Hook: ${d.hook}\n\nAngle: ${d.angle}\n\nWhy: ${d.why || d.reason || d.strategy || d.painPoint || "Builds audience trust."}`,
        source: "plan",
        dayNumber: d.day,
        status: "saved",
        platform: d.platform,
        format: d.format,
        goal: d.goal,
      });
      if (res.success) {
        setSavedDays((prev) => new Set([...prev, index]));
        toast.success(`Day ${d.day} saved to My Content!`);
      }
    } catch {
      toast.error("Error saving day");
    }
  };

  const handleCopyDay = (d, i) => {
    navigator.clipboard.writeText(
      `Day ${d.day}: ${d.title}\n\n${d.hook}\n\n${d.angle}\n\n${d.why || d.reason || d.strategy || d.painPoint || "Builds audience trust."}`
    );
    setCopiedDay(i);
    toast.success(`Copied Day ${d.day}`);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  const handlePDF = () => {
    const cardHtml = (d) => `
      <div style="background:#fff;border-radius:12px;border:1px solid #f1f5f9;padding:15px;margin-bottom:15px;break-inside:avoid">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:30px;height:30px;background:${d.color};border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:12px">${d.day}</div>
            <div style="font-size:12px;font-weight:800;color:#07122b">${d.goal}</div>
          </div>
          <div style="font-size:9px;font-weight:700;color:#64748b;background:#f8fafc;padding:2px 8px;border-radius:5px">${d.format}</div>
        </div>
        <div style="font-size:13px;font-weight:800;color:#07122b;margin-bottom:8px">${d.title}</div>
        <div style="background:#f0f9ff;padding:8px 10px;border-radius:8px;margin-bottom:5px;font-size:11px;color:#0369a1;border-left:3px solid #0ea5e9 italic">"${d.hook}"</div>
        <div style="font-size:11px;color:#475569;margin-bottom:5px"><strong>Angle:</strong> ${d.angle}</div>
        <div style="font-size:10px;color:#1e293b;background:#f0fdf4;padding:6px;border-radius:6px;border:1px solid #bbf7d0"><strong>Why:</strong> ${d.why}</div>
      </div>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Weekly Plan - ${idea.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
          body { background: #fff; padding: 0; }
          .page { width: 210mm; height: 297mm; padding: 20mm; position: relative; background: #fff7ed; overflow: hidden; page-break-after: always; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fed7aa; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 20px; font-weight: 900; color: #07122b; }
          .logo span { color: #f97316; }
          .badge { background: #f97316; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .hero { background: #07122b; border-radius: 16px; padding: 25px; color: #fff; margin-bottom: 30px; }
          .hero-label { font-size: 9px; font-weight: 800; color: #f97316; text-transform: uppercase; margin-bottom: 5px; }
          .hero-title { font-size: 24px; font-weight: 900; margin-bottom: 10px; }
          .hero-desc { font-size: 12px; color: #94a3b8; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #fed7aa; padding-top: 10px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="logo">PlanMy<span>Content</span></div>
            <div class="badge">7-Day Strategy Plan</div>
          </div>
          <div class="hero">
            <div class="hero-label">Content Concept</div>
            <div class="hero-title">${idea.title}</div>
            <div class="hero-desc">${idea.hook || ""}</div>
            <div style="margin-top:15px; display:flex; gap:10px">
               <span style="background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px; font-size:10px">${idea.platform || ""}</span>
               <span style="background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px; font-size:10px">${idea.type || ""}</span>
            </div>
          </div>
          <div style="font-size:14px; font-weight:900; color:#07122b; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px">Days 01 - 04</div>
          <div class="grid">
            ${plan.slice(0, 4).map(cardHtml).join("")}
          </div>
          <div class="footer">
            <span>Generated by PlanMyContent AI</span>
            <span>Page 01 / 02</span>
          </div>
        </div>

        <div class="page">
          <div class="header">
            <div class="logo">PlanMy<span>Content</span></div>
            <div class="badge">7-Day Strategy Plan</div>
          </div>
          <div style="font-size:14px; font-weight:900; color:#07122b; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px">Days 05 - 07</div>
          <div class="grid">
            ${plan.slice(4, 7).map(cardHtml).join("")}
            <div style="background:linear-gradient(135deg, #f97316, #fb923c); border-radius:12px; padding:20px; color:#fff; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center">
               <div style="font-size:30px; margin-bottom:10px">Ready</div>
               <div style="font-size:14px; font-weight:900; margin-bottom:5px">Ready to Launch!</div>
               <div style="font-size:10px; opacity:0.9">Your strategy is optimized for ${idea.platform}. Start posting today to see results!</div>
            </div>
          </div>
          <div style="margin-top:40px; background:#fff; border-radius:12px; padding:20px; border:1px solid #fed7aa">
            <div style="font-size:12px; font-weight:900; color:#f97316; margin-bottom:10px; text-transform:uppercase">Final Strategic Advice</div>
            <div style="font-size:12px; color:#334155; line-height:1.6">
              Consistency is key. Follow this roadmap to build a cohesive narrative for your brand.
              Always engage with the first 5-10 comments to boost your initial reach!
            </div>
          </div>
          <div class="footer">
            <span>Generated by PlanMyContent AI</span>
            <span>Page 02 / 02</span>
          </div>
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--app-bg)]">
        <div className="relative">
          <div className="h-24 w-24 rounded-3xl border-4 border-[var(--app-border)] border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-orange-500 animate-pulse" size={32} />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-black text-[var(--app-text)] animate-pulse">
          Crafting Your Strategy...
        </h2>
        <p className="mt-2 text-[var(--muted-text)] font-medium">Our AI is building your high-performance roadmap.</p>
      </div>
    );
  }

  if (!loading && (!plan || plan.length === 0)) {
    return (
      <WorkspaceShell
        badge="System Error"
        title="Strategy Not Found"
        description="We couldn't retrieve your weekly plan. Please try generating it again from the results page."
        backTo="/dashboard"
        backLabel="Dashboard"
      >
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-3xl p-8 text-red-500" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertCircle size={48} />
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{ boxShadow: "0 8px 30px rgba(249,115,22,0.3)" }}
          >
            Back to Dashboard
          </button>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      badge="7-Day Strategic Roadmap"
      section="WeeklyPlan"
      title={idea.title || "Strategic Content Plan"}
      description="Your 7-day high-performance roadmap is ready. Each day is optimized for audience growth and engagement."
      backTo={location.state?.fromDashboard ? "/dashboard" : "/ResultPage"}
      backLabel={location.state?.fromDashboard ? "Dashboard" : "Back"}
      actions={
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate("/GAV", {
                state: { onboardingData: onboarding, selectedIdea: idea },
              })
            }
            className="rounded-2xl border px-5 py-3 text-sm font-bold transition-all"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--app-border)",
              color: "var(--muted-text)",
            }}
          >
            Generate Another Version
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePDF}
            className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600"
          >
            Export PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveWholePlan}
            className={`rounded-2xl px-6 py-3 text-sm font-black text-white shadow-lg transition-all ${
              savedOk ? "bg-emerald-500 shadow-emerald-500/20" : "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600"
            }`}
          >
            {savedOk ? "Plan Saved!" : "Save Roadmap"}
          </motion.button>
        </div>
      }
      hero={
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[40px] p-8 shadow-[0_30px_80px_rgba(7,18,43,0.1)] relative overflow-hidden transition-all duration-500 ${
            isDark ? "bg-[#07122b] text-white" : "bg-white border border-slate-100 text-[#07122b]"
          }`}
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CalendarDays size={120} />
          </div>
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                Core Strategy Topic
              </p>
              <h2 className={`mt-3 text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#07122b]"}`}>{idea.title}</h2>
              <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                {idea.hook || "A comprehensive 7-day tactical roadmap designed to maximize your brand reach on social media."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className={`rounded-2xl border px-5 py-3 backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Platforms</p>
                <p className="mt-1 font-bold text-orange-500">
                  {onboarding.contentType?.platforms?.join(" | ") || idea.platform || "Instagram"}
                </p>
              </div>
              <div className={`rounded-2xl border px-5 py-3 backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Target Format</p>
                <p className="mt-1 font-bold text-blue-500">
                  {onboarding.contentType?.contentTypes?.slice(0, 2).join(" | ") || idea.type || "Post"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      }
      contentClassName="mx-auto max-w-6xl pb-20"
    >
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {strategySnapshot.map((item) => {
          const StatIcon = item.Icon;
          return (
            <div
              key={item.label}
              className="rounded-[28px] border border-[var(--app-border)] bg-[var(--card-bg)] p-5 shadow-sm transition-colors duration-300"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] ${item.tone}`}
              >
                <StatIcon size={20} />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-text)] opacity-60">
                {item.label}
              </p>
              <p className="mt-2 text-base font-black leading-tight text-[var(--app-text)]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-10 rounded-[32px] border border-[var(--app-border)] bg-[var(--card-bg)] p-6 shadow-sm transition-colors duration-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
              Strategy Snapshot
            </p>
            <h3 className="mt-3 text-2xl font-black text-[var(--app-text)]">
              This 7-day plan is built from the exact idea you selected
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-text)]">
              We used your selected result, onboarding answers, and surrounding content strategy to sequence the week from awareness into action.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                Source
              </p>
              <p className="mt-2 text-sm font-bold capitalize" style={{ color: "var(--app-text)" }}>
                {String(sourcePage).replace(/-/g, " ")}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                Related Ideas Used
              </p>
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--app-text)" }}>
                {sourceResults.length || 1}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                Best Cadence
              </p>
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--app-text)" }}>
                {onboarding.contentType?.postingFrequency || "4 Times / Week"}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                Funnel Flow
              </p>
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--app-text)" }}>
                Awareness to Conversion
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <AnimatePresence>
          {plan.map((d, i) => {
            const DayIcon = d.Icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col rounded-[45px] border border-[var(--app-border)] bg-[var(--card-bg)] p-8 shadow-sm transition-all hover:border-orange-500/30 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:bg-[var(--soft-bg)]`}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--soft-bg)] px-3 py-2 border border-[var(--app-border)]">
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted-text)]">
                      Day {String(d.day).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-[var(--app-border)] bg-[var(--card-bg)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-text)] shadow-sm">
                    {d.format || "Post"}
                  </div>
                </div>

                <div className="mb-6 flex items-start gap-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] text-white shadow-lg"
                    style={{ 
                      backgroundColor: d.color,
                      boxShadow: `0 10px 20px ${d.color}30`
                    }}
                  >
                    <DayIcon size={20} className="rotate-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-text)] opacity-40">
                      Daily Goal
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-[var(--app-text)]">
                      {d.goal}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-text)]">
                      Built for {formatDisplayList(d.platform || "Instagram")} with {getArticle(
                        String(d.result || "engagement").toLowerCase()
                      )} {String(d.result || "engagement").toLowerCase()} focus.
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="rounded-[28px] border border-[var(--app-border)] p-6" style={{ background: isDark ? "rgba(249,115,22,0.07)" : "rgba(249,115,22,0.05)" }}>
                    <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-orange-500">
                      Concept Title
                    </p>
                    <p className="text-base font-bold leading-tight" style={{ color: "var(--app-text)" }}>
                      {d.title}
                    </p>
                  </div>
 
                  <div className="grid grid-cols-1 gap-4">
                    <div
                      className="rounded-[28px] border border-[var(--app-border)] p-6"
                      style={{ background: isDark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.05)" }}
                    >
                      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-blue-500">
                        The Hook
                      </p>
                      <p className="text-sm font-medium italic leading-relaxed" style={{ color: "var(--muted-text)" }}>
                        "{d.hook}"
                      </p>
                    </div>
 
                    <div className="rounded-[28px] border border-[var(--app-border)] p-6" style={{ background: isDark ? "rgba(168,85,247,0.07)" : "rgba(168,85,247,0.05)" }}>
                      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-purple-500">
                        Creative Angle
                      </p>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--muted-text)" }}>
                        {d.angle}
                      </p>
                    </div>
                  </div>
 
                  <div className="rounded-[28px] border border-[var(--app-border)] p-6" style={{ background: isDark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.05)" }}>
                    <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-500">
                      Why This Works
                    </p>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--muted-text)" }}>
                      {d.why || d.reason || d.strategy || d.painPoint || "This angle effectively targets the audience's core problem, driving engagement and building trust."}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-[22px] border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                        CTA
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: "var(--app-text)" }}>
                        {d.cta || "Start the conversation"}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                        Best Time
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold leading-snug" style={{ color: "var(--app-text)" }}>
                        <Clock3 size={14} className="text-orange-400" />
                        {d.time || "8:00 AM"}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted-text)] opacity-40">
                        KPI
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: "var(--app-text)" }}>
                        {d.result || "Engagement"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyDay(d, i)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-black uppercase tracking-widest transition-all"
                    style={{
                      background: copiedDay === i ? "rgba(249,115,22,0.15)" : "var(--soft-bg)",
                      borderColor: copiedDay === i ? "rgba(249,115,22,0.3)" : "var(--app-border)",
                      color: copiedDay === i ? "#fb923c" : "var(--muted-text)",
                    }}
                  >
                    {copiedDay === i ? "Copied!" : "Copy Strategy"}
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRefiningDay(refiningDay === i ? null : i)}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all"
                    style={{
                      background: refiningDay === i ? "#3b82f6" : "var(--soft-bg)",
                      borderColor: refiningDay === i ? "#3b82f6" : "var(--app-border)",
                      color: refiningDay === i ? "white" : "var(--muted-text)",
                    }}
                    title="Refine this day with AI"
                  >
                    <Wand2 size={20} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSaveSingleDay(d, i)}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all"
                    style={{
                      background: savedDays.has(i) ? "#f97316" : "var(--soft-bg)",
                      borderColor: savedDays.has(i) ? "#f97316" : "var(--app-border)",
                      color: savedDays.has(i) ? "white" : "var(--muted-text)",
                    }}
                  >
                    <Bookmark size={20} />
                  </motion.button>
                </div>

                {refiningDay === i && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-3 overflow-hidden"
                  >
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-blue-400" size={18} />
                      <textarea
                        value={refinementFeedback}
                        onChange={(e) => setRefinementFeedback(e.target.value)}
                        placeholder="Tell AI what to change... (e.g. 'Make it more funny' or 'Focus on a different product')"
                        className="w-full rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] p-4 pl-12 text-sm text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none focus:border-blue-400 focus:bg-[var(--card-bg)] min-h-[100px] resize-none transition-colors duration-200"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRefineDay(i)}
                        disabled={isRefining || !refinementFeedback.trim()}
                        className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isRefining ? "Refining..." : "Apply AI Refinement"}
                      </button>
                      <button
                        onClick={() => {
                          setRefiningDay(null);
                          setRefinementFeedback("");
                        }}
                        className="rounded-xl border border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-3 text-sm font-bold text-[var(--muted-text)] hover:bg-[var(--card-bg)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </WorkspaceShell>
  );
}
