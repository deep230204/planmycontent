import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";

const pillTone = {
  idea: "bg-purple-50 text-purple-600 border-purple-100",
  plan: "bg-blue-50 text-blue-600 border-blue-100",
  manual: "bg-emerald-50 text-emerald-600 border-emerald-100",
  default: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function SingleIdeaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedIdea = useMemo(() => {
    const fromState = location.state?.selectedIdea || location.state?.idea;
    if (fromState) {
      localStorage.setItem("latestSingleIdea", JSON.stringify(fromState));
      return fromState;
    }

    return JSON.parse(localStorage.getItem("latestSingleIdea") || "null") || {};
  }, [location.state]);

  const onboardingData = useMemo(
    () =>
      location.state?.onboardingData ||
      JSON.parse(localStorage.getItem("latestOnboardingData") || "null") ||
      {},
    [location.state]
  );

  const ideaType =
    selectedIdea?.source === "plan"
      ? "plan"
      : selectedIdea?.source === "manual"
        ? "manual"
        : "idea";

  const stats = [
    {
      label: "Platform",
      value: selectedIdea.platform || onboardingData.contentType?.platforms?.[0] || "Multi-channel",
      Icon: Sparkles,
    },
    {
      label: "Format",
      value: selectedIdea.type || selectedIdea.format || onboardingData.contentType?.contentTypes?.[0] || "Post",
      Icon: CalendarDays,
    },
    {
      label: "Positioning",
      value: selectedIdea.engagement || selectedIdea.badge || "High Potential",
      Icon: Target,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${selectedIdea.title || "Untitled idea"}\n\n${selectedIdea.description || selectedIdea.hook || ""}\n\nAngle: ${selectedIdea.angle || "Not set"}\nPain Point: ${selectedIdea.painPoint || "Not set"}`
    );
    toast.success("Idea copied to clipboard!");
  };

  if (!selectedIdea?.title) {
    return (
      <WorkspaceShell
        badge="Idea Workspace"
        dashboardSection="Ideas"
        title="No saved idea found"
        description="We couldn't find the idea you were trying to open."
        backTo="/ideas"
        backLabel="Ideas"
      >
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="mb-5 rounded-full bg-orange-50 p-6 text-orange-500 dark:bg-orange-500/12 dark:text-orange-300">
            <Lightbulb size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-[var(--app-text)]">Open a saved idea first</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-[var(--muted-text)]">
            Go back to your idea library or dashboard and choose a saved idea to continue.
          </p>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      badge="Idea Workspace"
      dashboardSection="Ideas"
      title={selectedIdea.title}
      description="Review one saved concept, then decide whether to generate variations or build a full content plan."
      backTo="/ideas"
      backLabel="Ideas"
      contentClassName="mx-auto max-w-6xl"
    >
      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#07122b] via-[#10203a] to-[#1a3154] p-8 text-white shadow-[0_30px_70px_rgba(7,18,43,0.18)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-orange-300">
            <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] ${pillTone[ideaType] || pillTone.default}`}>
              Saved {ideaType === "idea" ? "Idea" : ideaType === "plan" ? "Plan" : "Draft"}
            </span>
            Single Concept
          </div>

          <h2 className="mt-6 text-3xl font-black leading-tight lg:text-4xl">
            Build the next step from this one strong idea.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            Use variations if you want to explore different creative styles, or go straight into a full plan if this concept already feels right.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate("/GAV", {
                  state: {
                    selectedIdea,
                    onboardingData,
                  },
                })
              }
              className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Explore Variations
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("latestWeeklyPlan");
                navigate("/WeeklyPlanPage", {
                  state: {
                    selectedIdea,
                    onboardingData,
                  },
                });
              }}
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-white/10"
            >
              Build Full Plan
            </button>
            <button
              onClick={handleCopy}
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/85 transition-all duration-300 hover:bg-white/10"
            >
              Copy Idea
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm dark:border-[var(--app-border)] dark:bg-[var(--card-bg)] dark:shadow-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/12 dark:text-orange-300">
                <item.Icon size={20} />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-[var(--muted-text)]">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-black text-slate-900 dark:text-[var(--app-text)]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-orange-100 bg-orange-50/40 p-6 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">
            Description
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-[var(--app-text)]">
            {selectedIdea.description || selectedIdea.hook || "No detailed description was saved for this idea yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-blue-100 bg-blue-50/40 p-6 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
            Hook
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-[var(--app-text)]">
            {selectedIdea.hook || "No hook was saved for this idea yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-purple-100 bg-purple-50/40 p-6 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-500">
            Angle
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-[var(--app-text)]">
            {selectedIdea.angle || "No angle was saved for this idea yet."}
          </p>
        </div>

        <div className="rounded-[32px] border border-pink-100 bg-pink-50/40 p-6 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-pink-500">
            Pain Point
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-[var(--app-text)]">
            {selectedIdea.painPoint || "No pain point was saved for this idea yet."}
          </p>
        </div>
      </section>

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-[var(--app-border)] dark:bg-[var(--card-bg)] dark:shadow-none">
        <div>
          <p className="text-lg font-black text-slate-900 dark:text-[var(--app-text)]">Choose your next move</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-[var(--muted-text)]">
            Variations help you compare creative directions. Full plans turn this into a weekly publishing strategy.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              navigate("/GAV", {
                state: { selectedIdea, onboardingData },
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-orange-200 hover:text-orange-500 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)] dark:text-[var(--app-text)]"
          >
            <Sparkles size={16} />
            Open Variations
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("latestWeeklyPlan");
              navigate("/WeeklyPlanPage", {
                state: { selectedIdea, onboardingData },
              });
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#07122b] px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-orange-500"
          >
            <ArrowRight size={16} />
            Generate Full Content Plan
          </button>
        </div>
      </section>
    </WorkspaceShell>
  );
}
