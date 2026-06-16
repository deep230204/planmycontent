import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Wand2,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  Check,
} from "lucide-react";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import {
  GENERATED_RESULTS_KEY,
  readIdeasPayload,
} from "../utils/resultStorage";

export default function RefinementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingData =
    location.state?.onboardingData ||
    JSON.parse(localStorage.getItem("latestOnboardingData") || "null") ||
    {};
  const currentIdeas =
    location.state?.currentIdeas ||
    readIdeasPayload(GENERATED_RESULTS_KEY)?.ideas ||
    [];

  const [selectedMood, setSelectedMood] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const feedbackOptions = [
    {
      id: "premium",
      label: "Make Ideas More Premium",
    },
    {
      id: "festival",
      label: "Add Festival Content",
    },
    {
      id: "reels",
      label: "Focus More On Reels",
    },
    {
      id: "engagement",
      label: "Increase Engagement",
    },
  ];

  return (
    <WorkspaceShell
      badge="AI Refinement"
      section="Results"
      title="Refine your content direction"
      description="Adjust tone, format, and quality so the regenerated ideas feel more premium, more focused, and closer to your brand."
      backTo="/ResultPage"
      backLabel="Main Strategy"
      contentClassName="mx-auto max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-[40px] p-8 sm:p-12 lg:p-16"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--app-border)",
          boxShadow: "var(--shadow-premium)",
        }}>
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-[0_15px_35px_rgba(249,115,22,0.3)]">
              <Wand2 size={34} className="animate-pulse" />
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight lg:text-5xl" style={{ color: "var(--app-text)" }}>
              Refine Your Content Plan
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--muted-text)" }}>
              Tell AI what you want to improve so we can regenerate better and
              more personalized content ideas.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Feedback Options */}
            <div className="rounded-[30px] p-6" style={{ background: "rgba(249,115,22,0.03)", border: "1px solid var(--app-border)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ color: "var(--app-text)" }}>What Should Improve?</h3>
                  <p className="text-sm font-medium" style={{ color: "var(--muted-text)" }}>Select quick suggestions below.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {feedbackOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFeedback(item.label);
                      setSelectedSuggestion(item.id);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-1"
                    style={{
                      borderColor: selectedSuggestion === item.id ? "rgba(249,115,22,0.4)" : "var(--app-border)",
                      background: selectedSuggestion === item.id ? "rgba(249,115,22,0.15)" : "var(--card-bg)",
                      color: selectedSuggestion === item.id ? "#fb923c" : "var(--app-text)",
                      boxShadow: selectedSuggestion === item.id ? "0 8px 20px rgba(249,115,22,0.2)" : "none",
                    }}
                  >
                    {selectedSuggestion === item.id && <Check size={16} />}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selector */}
            <div className="rounded-[30px] p-6" style={{ background: "rgba(59,130,246,0.03)", border: "1px solid var(--app-border)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400" style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ color: "var(--app-text)" }}>How Do You Feel?</h3>
                  <p className="text-sm font-medium" style={{ color: "var(--muted-text)" }}>Select your satisfaction level.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { id: "Good", icon: Smile, color: "#34d399", glow: "rgba(52,211,153,0.1)" },
                  { id: "Average", icon: Meh, color: "#fbbf24", glow: "rgba(251,191,36,0.1)" },
                  { id: "Bad", icon: Frown, color: "#f87171", glow: "rgba(248,113,113,0.1)" }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className="flex min-h-[120px] flex-col items-center justify-center rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      borderColor: selectedMood === m.id ? `${m.color}60` : "var(--app-border)",
                      background: selectedMood === m.id ? m.glow : "var(--card-bg)",
                      color: selectedMood === m.id ? m.color : "var(--muted-text)",
                    }}
                  >
                    <m.icon size={30} />
                    <span className="mt-3 text-sm font-bold">{m.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Feedback */}
          <div className="mt-8 rounded-[32px] p-8" style={{ background: "var(--soft-bg)", border: "1px solid var(--app-border)" }}>
            <h3 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Additional Feedback</h3>
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--muted-text)" }}>Describe what kind of ideas you want next.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={300}
              placeholder="Example: Make ideas more premium, focus on Instagram reels, add festival content..."
              className="mt-6 min-h-[220px] w-full rounded-[24px] p-6 text-sm outline-none transition-all duration-300"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--app-border)",
                color: "var(--app-text)",
              }}
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: "var(--muted-text)" }}>More detailed feedback gives better results.</p>
              <p className="text-xs font-bold" style={{ color: "var(--muted-text)" }}>{feedback.length}/300</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => navigate("/ResultPage")}
              className="rounded-[22px] px-8 py-4 text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{ background: "var(--soft-bg)", border: "1px solid var(--app-border)", color: "var(--muted-text)" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  localStorage.removeItem("latestRefinedResult");
                  navigate("/UpdateLoadingPage", {
                    state: { onboardingData, currentIdeas, refinementText: feedback, selectedMood, isRegenerated: true },
                  });
                }, 1500);
              }}
              disabled={loading}
              className="flex items-center gap-3 rounded-[22px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ boxShadow: "0 12px 30px rgba(249,115,22,0.3)" }}
            >
              {loading ? (
                <><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div> Redirecting...</>
              ) : (
                <><Wand2 size={18} /> Regenerate Content Ideas</>
              )}
            </button>
          </div>
      </div>
    </WorkspaceShell>
  );
}
