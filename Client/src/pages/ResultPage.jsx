import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
  RotateCcw,
  Sparkles,
  Target,
  Users,
  Calendar,
  Search,
  Wand2,
  Plus,
  Zap,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { saveContent, saveIdea } from "../services/dashboardService";
import { toast } from "sonner";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import {
  PLATFORM_FILTERS,
  getPlatformLabel,
  matchesPlatformFilter,
} from "../utils/platformFilters";
import {
  GENERATED_RESULTS_KEY,
  normalizeIdeasPayload,
  readIdeasPayload,
  writeIdeasPayload,
} from "../utils/resultStorage";

export default function ResultPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedResults, setGeneratedResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedIdeaIds, setSavedIdeaIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());
  const [dislikedIds, setDislikedIds] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedIds, setCopiedIds] = useState(new Set());
  const [isEnhancing, setIsEnhancing] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );

  const onboardingData = useMemo(
    () =>
      location.state?.onboardingData ||
      JSON.parse(localStorage.getItem("latestOnboardingData") || "null") ||
      {},
    [location.state]
  );

  useEffect(() => {
    const checkData = () => {
      const stored =
        normalizeIdeasPayload(location.state?.generatedResults) ||
        readIdeasPayload(GENERATED_RESULTS_KEY);

      // Handle nested or flat data structures safely
      const rawIdeas = Array.isArray(stored?.ideas) ? stored.ideas : (Array.isArray(stored) ? stored : null);

      if (rawIdeas && rawIdeas.length > 0) {
        setGeneratedResults({ ideas: rawIdeas });
        setLoading(false);
        return true;
      }
      return false;
    };

    if (!checkData()) {
      // Just set loading false after a small delay if no data is found, to show the empty state
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 animate-pulse" style={{ boxShadow: "0 0 40px rgba(249,115,22,0.4)" }}>
            <Sparkles className="text-white" size={28} />
          </div>
          <p className="text-lg font-black animate-pulse" style={{ color: "#fb923c" }}>
            Retrieving Strategy...
          </p>
        </div>
      </div>
    );
  }

  if (!generatedResults || !generatedResults.ideas || generatedResults.ideas.length === 0) {
    return (
      <WorkspaceShell
        badge="System Message"
        section="Results"
        title="No content strategy found"
        description="We couldn't find any recent strategy results for your account."
        backTo="/dashboard"
        backLabel="Dashboard"
      >
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-black" style={{ color: "var(--app-text)" }}>Ready to build your strategy?</h2>
          <p className="mt-4 max-w-md" style={{ color: "var(--muted-text)" }}>
            Complete the onboarding process to generate your high-performance content roadmap and AI-powered ideas.
          </p>
          <div className="mt-10 flex gap-4">
            <button
              onClick={() => navigate("/onboarding")}
              className="rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105"
              style={{ boxShadow: "0 8px 30px rgba(249,115,22,0.35)" }}
            >
              Start Onboarding
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl px-8 py-4 font-bold transition-all hover:bg-orange-500/5"
              style={{ border: "1px solid var(--app-border)", color: "var(--muted-text)" }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </WorkspaceShell>
    );
  }

  const handleSaveSingleIdea = async (idea) => {
    if (!user) return toast.error("Please login first");
    try {
      const res = await saveContent(user._id || user.id, {
        title: idea.title,
        body: `Description: ${idea.description || "No description"}\n\nHook: ${idea.hook || "No hook"}\n\nAngle: ${idea.angle || "No angle"}\n\nPain Point: ${idea.painPoint || "No pain point"}`,
        source: "idea",
        status: "saved",
        platform: idea.platform,
        format: idea.type,
        hook: idea.hook,
        angle: idea.angle,
        painPoint: idea.painPoint,
      });
      if (res.success) {
        setSavedIdeaIds((prev) => new Set([...prev, idea.title]));
        toast.success("Idea saved to My Content!");
      }
    } catch (e) {
      toast.error("Error saving idea");
    }
  };
  
  const handleEnhanceIdea = async (idea, index) => {
    try {
      setIsEnhancing((prev) => ({ ...prev, [index]: true }));
      const res = await axios.post("http://localhost:5000/api/auth/enhance-idea", {
        idea,
        onboardingData,
      });

      if (res.data.success) {
        const enhancedIdea = res.data.data;
        const updatedIdeas = [...generatedResults.ideas];
        updatedIdeas[index] = enhancedIdea;
        setGeneratedResults({ ...generatedResults, ideas: updatedIdeas });
        writeIdeasPayload(GENERATED_RESULTS_KEY, {
          ...generatedResults,
          ideas: updatedIdeas,
        });
        toast.success("Strategy enhanced with AI expert logic!", {
          icon: <Wand2 className="h-4 w-4 text-orange-500" />,
        });
      }
    } catch (error) {
      toast.error("Failed to enhance idea");
    } finally {
      setIsEnhancing((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSaveFullPlan = async () => {
    if (!user) return toast.error("Please login first");
    try {
      const ideas = generatedResults?.ideas || [];
      const results = await Promise.all(
        ideas.map((idea) => saveIdea(user._id || user.id, idea))
      );
      if (results.every((item) => item.success)) {
        toast.success("Full topic ideas saved to Content Ideas!");
      }
    } catch (e) {
      toast.error("Error saving strategy");
    }
  };

  const handleCopy = (idea, index) => {
    const text = `${idea.title}\n\nHook: ${idea.hook}\nAngle: ${idea.angle}`;
    navigator.clipboard.writeText(text);
    setCopiedIds((prev) => new Set([...prev, index]));
    setTimeout(() => {
      setCopiedIds((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 2000);
  };

  const formatList = (value, fallback) => {
    if (Array.isArray(value) && value.length > 0) return value.join(" + ");
    if (typeof value === "string" && value.trim()) return value.trim();
    return fallback;
  };

  const getAudienceValue = () => {
    const parts = [
      onboardingData.audience?.profession,
      onboardingData.audience?.audienceType,
      onboardingData.audience?.ageGroup,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" • ") : "Students & Creators";
  };

  const summaryCards = [
    {
      title: "Brand Goal",
      value: formatList(
        onboardingData.goals?.primaryGoal,
        "Increase Engagement"
      ),
      icon: <Target size={20} />,
      color: "from-orange-500 to-amber-400",
    },
    {
      title: "Audience",
      value: getAudienceValue(),
      icon: <Users size={20} />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Posting Frequency",
      value: onboardingData.contentType?.postingFrequency || "4 Times / Week",
      icon: <Calendar size={20} />,
      color: "from-emerald-500 to-green-400",
    },
    {
      title: "Content Type",
      value: formatList(
        onboardingData.contentType?.contentTypes,
        "Reels + Carousel"
      ),
      icon: <Sparkles size={20} />,
      color: "from-purple-500 to-pink-400",
    },
  ];

  const ideas = (generatedResults?.ideas || []).slice(0, 10);
  const filteredIdeas = ideas.filter((idea) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (idea.title || "").toLowerCase().includes(search) ||
      (idea.platform || "").toLowerCase().includes(search);
    const matchesFilter = matchesPlatformFilter(idea.platform, activeFilter);
    return matchesSearch && matchesFilter;
  });

  const getScoreLabel = (idea) =>
    idea.engagementScore || idea.score || "High Engagement";
  const getDifficulty = (idea) => idea.difficulty || "Easy";
  const getFormat = (idea) => idea.type || idea.format || "Reel";
  const getPotential = (idea) => idea.potential || "High Potential";

  const getPlatformBadgeStyles = (platformName) => {
    const p = (platformName || "").toLowerCase();
    if (p.includes("linkedin")) {
      return {
        color: "text-sky-400 dark:text-sky-400",
        background: "rgba(56,189,248,0.1)",
        border: "1px solid rgba(56,189,248,0.2)"
      };
    }
    if (p.includes("youtube")) {
      return {
        color: "text-red-400 dark:text-red-400",
        background: "rgba(248,113,113,0.1)",
        border: "1px solid rgba(248,113,113,0.2)"
      };
    }
    if (p.includes("instagram")) {
      return {
        color: "text-pink-400 dark:text-pink-400",
        background: "rgba(244,114,182,0.1)",
        border: "1px solid rgba(244,114,182,0.2)"
      };
    }
    if (p.includes("facebook")) {
      return {
        color: "text-indigo-400 dark:text-indigo-400",
        background: "rgba(129,140,248,0.1)",
        border: "1px solid rgba(129,140,248,0.2)"
      };
    }
    if (p.includes("twitter") || p === "x") {
      return {
        color: "text-slate-300 dark:text-slate-300",
        background: "rgba(148,163,184,0.1)",
        border: "1px solid rgba(148,163,184,0.2)"
      };
    }
    return {
      color: "text-orange-400 dark:text-orange-400",
      background: "rgba(249,115,22,0.1)",
      border: "1px solid rgba(249,115,22,0.2)"
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 animate-pulse" style={{ boxShadow: "0 0 40px rgba(249,115,22,0.4)" }}>
            <Sparkles className="text-white" size={28} />
          </div>
          <p className="text-lg font-black animate-pulse" style={{ color: "#fb923c" }}>
            Generating AI Strategy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceShell
      badge="AI Strategy Results"
      section="Results"
      title="Your premium content strategy is ready"
      description="Review your personalized ideas, compare angles, and turn the best concepts into detailed weekly plans."
      backTo="/onboarding"
      backLabel="Back"
      actions={
      <>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:bg-orange-500/5"
            style={{ border: "1px solid var(--app-border)", color: "var(--muted-text)" }}
          >
            Dashboard
          </button>
          <button
            onClick={handleSaveFullPlan}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600"
            style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.3)" }}
          >
            Save Strategy
          </button>
        </>
      }
      hero={
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl p-5 transition-all hover:-translate-y-1"
              style={{
                background: "var(--soft-bg)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--shadow-premium)",
              }}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                {card.icon}
              </div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-text)" }}>
                {card.title}
              </p>
              <h3 className="text-base font-bold" style={{ color: "var(--app-text)" }}>
                {card.value}
              </h3>
            </div>
          ))}
        </div>
      }
      contentClassName="relative mx-auto max-w-7xl"
    >
      <div
        style={{ pointerEvents: "none", zIndex: 0 }}
        className="absolute left-10 top-10 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl"
      />
      <div
        style={{ pointerEvents: "none", zIndex: 0 }}
        className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl"
      />

      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black tracking-tight lg:text-5xl" style={{ color: "var(--app-text)" }}>
          Your Content Strategy is Ready
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: "var(--muted-text)" }}>
          Based on your onboarding answers, here are your top personalized
          content ideas to grow your brand.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl p-5 lg:flex-row lg:items-center lg:justify-between"
        style={{ border: "1px solid var(--app-border)", background: "var(--card-bg)" }}>
        <div className="relative w-full lg:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-text)" }} />
          <input
            type="text"
            placeholder="Search YouTube, Facebook, LinkedIn ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
            style={{
              background: "var(--soft-bg)",
              border: "1px solid var(--app-border)",
              color: "var(--app-text)",
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all"
              style={{
                background: activeFilter === filter ? "#f97316" : "var(--soft-bg)",
                color: activeFilter === filter ? "#fff" : "var(--muted-text)",
                border: activeFilter === filter ? "1px solid transparent" : "1px solid var(--app-border)",
                boxShadow: activeFilter === filter ? "0 4px 14px rgba(249,115,22,0.3)" : "none",
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-orange-500" style={{ background: "rgba(249,115,22,0.1)" }}>
          <Lightbulb size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">AI Generated</p>
          <h3 className="text-lg font-black" style={{ color: "var(--app-text)" }}>Topic Ideas</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredIdeas.map((idea, index) => (
          <div
            key={index}
            className="group flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--app-border)",
              boxShadow: "var(--shadow-premium)",
            }}
          >
            {/* Card header */}
            <div className="mb-4 flex items-center justify-between">
              {(() => {
                const styles = getPlatformBadgeStyles(idea.platform);
                return (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${styles.color}`}
                    style={{ background: styles.background, border: styles.border }}
                  >
                    {getPlatformLabel(idea.platform)}
                  </span>
                );
              })()}
              <div className="flex items-center gap-2">
                <span className="rounded-full px-3 py-1 text-[11px] font-bold text-emerald-400"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  {getScoreLabel(idea)}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black"
                  style={{ background: "var(--soft-bg)", color: "var(--muted-text)" }}>
                  {index + 1}
                </span>
                <button
                  onClick={() => handleEnhanceIdea(idea, index)}
                  disabled={isEnhancing[index] || idea.isEnhanced}
                  className={`flex h-8 items-center gap-2 rounded-xl px-3 text-[10px] font-black transition-all active:scale-95 ${
                    idea.isEnhanced
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                  style={{ boxShadow: idea.isEnhanced ? "0 4px 14px rgba(52,211,153,0.3)" : "0 4px 14px rgba(249,115,22,0.3)" }}
                >
                  {isEnhancing[index] ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : idea.isEnhanced ? (
                    <><CheckCircle2 size={12} /> ENHANCED</>
                  ) : (
                    <><Wand2 size={12} /> MAGIC ENHANCE</>
                  )}
                </button>
              </div>
            </div>

            {/* Title & description */}
            <div className="mb-2 flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white"
                style={{ boxShadow: "0 8px 20px rgba(249,115,22,0.3)" }}>
                <Lightbulb size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black leading-tight" style={{ color: "var(--app-text)" }}>
                  {idea.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted-text)" }}>
                  {idea.description || [
                    "High-impact content strategy focused on maximizing audience engagement.",
                    "Data-driven approach to boost your brand presence and authority.",
                    "Creative content direction designed to convert followers into loyal customers.",
                    "Strategic roadmap for scaling your reach through storytelling.",
                    "Optimized content plan focused on consistent growth and visibility."
                  ][index % 5]}
                </p>
              </div>
            </div>

            {/* Hook / Angle / Pain Point */}
            <div className="mt-4 flex-1 space-y-2">
              <div className="rounded-2xl p-4" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-orange-500">Hook</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--app-text)" }}>{idea.hook}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}>
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-blue-400">Angle</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--app-text)" }}>{idea.angle}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-red-400">Pain Point</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--app-text)" }}>
                  {idea.painPoint || [
                    "Struggles with inconsistent engagement and low audience retention.",
                    "Difficulty in maintaining brand voice while scaling content production.",
                    "Lack of clarity in messaging leading to poor conversion rates.",
                    "Low visibility on key platforms despite regular posting.",
                    "High competition making it hard to stand out in the current niche."
                  ][index % 5]}
                </p>
              </div>
            </div>

            {/* Tag pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "var(--soft-bg)", color: "var(--muted-text)" }}>
                {getFormat(idea)}
              </span>
              <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-orange-400" style={{ background: "rgba(249,115,22,0.1)" }}>
                {getPotential(idea)}
              </span>
              <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-blue-400" style={{ background: "rgba(96,165,250,0.1)" }}>
                {idea.difficulty || getDifficulty(idea)}
              </span>
              {idea.viralScore && (
                <span className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black text-rose-400" style={{ background: "rgba(251,113,133,0.1)" }}>
                  <Zap size={10} fill="currentColor" /> {idea.viralScore}% VIRAL
                </span>
              )}
            </div>

            {/* Action row */}
            <div className="mt-5 flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--app-border)" }}>
              <div className="flex gap-2">
                <button
                  onClick={() => setLikedIds((prev) => new Set([...prev, index]))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-all"
                  style={{
                    border: likedIds.has(index) ? "1px solid rgba(52,211,153,0.4)" : "1px solid var(--app-border)",
                    background: likedIds.has(index) ? "rgba(52,211,153,0.1)" : "var(--soft-bg)",
                    color: likedIds.has(index) ? "#34d399" : "var(--muted-text)",
                  }}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => setDislikedIds((prev) => new Set([...prev, index]))}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                  style={{
                    border: dislikedIds.has(index) ? "1px solid rgba(248,113,113,0.4)" : "1px solid var(--app-border)",
                    background: dislikedIds.has(index) ? "rgba(248,113,113,0.1)" : "var(--soft-bg)",
                    color: dislikedIds.has(index) ? "#f87171" : "var(--muted-text)",
                  }}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(idea, index)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                  style={{
                    border: copiedIds.has(index) ? "1px solid rgba(249,115,22,0.4)" : "1px solid var(--app-border)",
                    background: copiedIds.has(index) ? "rgba(249,115,22,0.1)" : "var(--soft-bg)",
                    color: copiedIds.has(index) ? "#fb923c" : "var(--muted-text)",
                  }}
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleSaveSingleIdea(idea)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                  style={{
                    border: savedIdeaIds.has(idea.title) ? "1px solid #f97316" : "1px solid var(--app-border)",
                    background: savedIdeaIds.has(idea.title) ? "#f97316" : "var(--soft-bg)",
                    color: savedIdeaIds.has(idea.title) ? "white" : "var(--muted-text)",
                  }}
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/WeeklyPlanPage", {
                  state: {
                    selectedIdea: idea,
                    onboardingData,
                    sourceResults: ideas,
                    sourcePage: "main-results",
                    fromDashboard: false,
                  },
                })
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.3)" }}
            >
              <Wand2 size={16} /> Generate Full Plan
            </button>
          </div>
        ))}
      </div>


      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleSaveFullPlan}
          className="flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105"
          style={{ background: "var(--card-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)", boxShadow: "var(--shadow-premium)" }}
        >
          <Bookmark size={18} className="text-orange-500" /> Save Full Plan
        </button>
        <button
          onClick={() =>
            navigate("/MoreLoading", { state: { onboardingData, existingIdeas: ideas } })
          }
          className="flex items-center gap-2 rounded-2xl px-8 py-4 font-bold transition-all hover:scale-105"
          style={{ background: "var(--soft-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
        >
          <Plus size={18} className="text-orange-500" /> Generate More
        </button>
        <button
          onClick={() =>
            navigate("/RefinementPage", {
              state: { onboardingData, currentIdeas: ideas },
            })
          }
          className="flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white transition-all hover:scale-105"
          style={{ boxShadow: "0 8px 30px rgba(249,115,22,0.35)" }}
        >
          <RotateCcw size={18} /> Regenerate
        </button>
      </div>
    </WorkspaceShell>
  );
}
