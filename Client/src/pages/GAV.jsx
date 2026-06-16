import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
  Shield,
  Flame,
  Heart,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { saveContent } from "../services/dashboardService";
import { toast } from "sonner";
import { useState } from "react";

import WorkspaceShell from "../components/Branding/common/WorkspaceShell";

export default function GAV() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedIdea = location.state?.selectedIdea || {
    title: "Content Idea #2",
    description:
      "Strong content idea designed to increase engagement and audience reach.",
  };
  const onboardingData =
    location.state?.onboardingData ||
    JSON.parse(localStorage.getItem("latestOnboardingData") || "null") ||
    {};

  const [savedIds, setSavedIds] = useState(new Set());
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSaveContent = async (item) => {
    if (!user) return toast.error("Please login first");
    try {
      const res = await saveContent(user._id || user.id, {
        title: selectedIdea.title + " (" + item.version + ")",
        body: `Hook: ${item.hook}\n\nAngle: ${item.angle}\n\nPain Point: ${item.painPoint}`,
        source: "idea",
        status: "saved",
        platform: item.platform,
        format: item.format,
        badge: item.badge
      });
      if (res.success) {
        setSavedIds((prev) => new Set([...prev, item.version]));
        toast.success("Variation saved to My Content!");
      }
    } catch {
      toast.error("Error saving variation");
    }
  };


  const versions = useMemo(() => {
    const platforms = onboardingData.contentType?.platforms || onboardingData.audience?.platforms || [];
    const contentTypes = onboardingData.contentType?.contentTypes || [];
    const goals = onboardingData.goals?.primaryGoal || [];
    const frustration = onboardingData.challenges?.frustration || "Your audience needs clearer, more engaging content.";
    const preferredPlatform = platforms.find((item) => item !== "Newsletter") || platforms[0] || "Instagram";

    return [
      {
        version: "Professional",
        platform: platforms.includes("LinkedIn") ? "LinkedIn" : preferredPlatform,
        badge: "Authority",
        number: "1",
        hook: `A professional angle for ${selectedIdea.title} that builds trust and credibility.`,
        angle: `Share expert insights and a clear framework aligned with ${goals[0] || "awareness"}.`,
        painPoint: frustration,
        format: contentTypes.includes("Carousel") ? "Carousel" : contentTypes[0] || "Carousel",
        potential: "High Potential",
        difficulty: "Medium",
        buttonText: "Generate Professional Plan",
        icon: Shield,
        iconBg: "from-blue-500 to-indigo-500",
      },
      {
        version: "Viral",
        platform: platforms.includes("Instagram") ? "Instagram" : preferredPlatform,
        badge: "Trending",
        number: "2",
        hook: `A sharper, faster hook for ${selectedIdea.title} that grabs attention immediately.`,
        angle: "Use emotion, momentum, and concise storytelling for stronger reach.",
        painPoint: frustration,
        format: contentTypes.includes("Short-form Video") ? "Short-form Video" : contentTypes[0] || "Reel",
        potential: "Very High",
        difficulty: "Easy",
        buttonText: "Generate Viral Plan",
        icon: Flame,
        iconBg: "from-orange-500 to-amber-400",
      },
      {
        version: "Storytelling",
        platform: preferredPlatform,
        badge: "Relatable",
        number: "3",
        hook: `Turn ${selectedIdea.title} into a more personal, relatable story.`,
        angle: "Lead with a real scenario, challenge, and transformation your audience connects with.",
        painPoint: frustration,
        format: contentTypes.includes("Post") ? "Post" : contentTypes[0] || "Post",
        potential: "High Potential",
        difficulty: "Medium",
        buttonText: "Generate Storytelling Plan",
        icon: Heart,
        iconBg: "from-pink-500 to-rose-400",
      },
    ];
  }, [onboardingData, selectedIdea]);

  return (
    <WorkspaceShell
      badge="AI Variations"
      section="WeeklyPlan"
      title="Choose a stronger version of this idea"
      description="Test different content styles before generating the weekly plan so the final strategy feels more premium and more intentional."
      backTo="/ResultPage"
      backLabel="Results"
      contentClassName="mx-auto max-w-7xl"
    >
      <div className="rounded-[36px] border border-orange-100 bg-white/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-[var(--app-border)] dark:bg-[var(--card-bg)] dark:shadow-none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
              AI Generated Variations
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-[var(--app-text)]">
              Generate Another Version
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500 dark:text-[var(--muted-text)]">
              Choose a different style of content plan for the same idea.
            </p>
          </div>

        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {versions.map((item, index) => (
            <div
              key={index}
              className="group flex h-full flex-col rounded-[32px] border border-orange-100 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_25px_50px_rgba(251,146,60,0.22)] dark:border-[var(--app-border)] dark:bg-[var(--card-bg)] dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-600 dark:bg-orange-500/12 dark:text-orange-300">
                  {item.platform}
                </span>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 dark:bg-emerald-500/12 dark:text-emerald-300">
                    {item.badge}
                  </span>

                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-[var(--soft-bg)] dark:text-[var(--muted-text)]">
                      {item.number}
                    </span>

                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-[var(--muted-text)]">
                      {item.version}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconBg} text-white shadow-lg`}
              >
                <item.icon size={24} />
              </div>

              <h2 className="mt-6 text-[2rem] font-bold leading-tight text-slate-900 dark:text-[var(--app-text)]">
                {selectedIdea.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-500 dark:text-[var(--muted-text)]">
                {selectedIdea.description}
              </p>

              <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-5 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
                  Hook
                </p>

                <p className="mt-3 text-sm text-slate-700 dark:text-[var(--app-text)]">{item.hook}</p>
              </div>

              <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-500">
                  Angle
                </p>

                <p className="mt-3 text-sm text-slate-700 dark:text-[var(--app-text)]">{item.angle}</p>
              </div>

              <div className="mt-5 rounded-3xl border border-pink-100 bg-pink-50 p-5 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)]">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-500">
                  Pain Point
                </p>

                <p className="mt-3 text-sm text-slate-700 dark:text-[var(--app-text)]">
                  {item.painPoint}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-[var(--soft-bg)] dark:text-[var(--app-text)]">
                  {item.format}
                </span>

                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600 dark:bg-orange-500/12 dark:text-orange-300">
                  {item.potential}
                </span>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-500/12 dark:text-blue-300">
                  {item.difficulty}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-3">
                  <button onClick={() => alert("Liked this variation!")} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-orange-200 hover:text-orange-500 cursor-pointer dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)] dark:text-[var(--muted-text)] dark:shadow-none">
                    <ThumbsUp size={18} />
                  </button>

                  <button onClick={() => alert("Disliked this variation.")} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-orange-200 hover:text-orange-500 cursor-pointer dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)] dark:text-[var(--muted-text)] dark:shadow-none">
                    <ThumbsDown size={18} />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${selectedIdea.title}\nHook: ${item.hook}\nAngle: ${item.angle}`);
                      alert("Variation copied!");
                    }} 
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-orange-200 hover:text-orange-500 cursor-pointer dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)] dark:text-[var(--muted-text)] dark:shadow-none"
                  >
                    <Copy size={18} />
                  </button>

                  <button
                    onClick={() => handleSaveContent(item)}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                      savedIds.has(item.version)
                        ? "border-orange-600 bg-orange-500 text-white"
                        : "border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:text-orange-500 dark:border-[var(--app-border)] dark:bg-[var(--soft-bg)] dark:text-[var(--muted-text)]"
                    } cursor-pointer`}
                  >
                    <Bookmark size={18} />
                  </button>

                </div>
              </div>

              <button
                onClick={() =>
                  {
                    localStorage.removeItem("latestWeeklyPlan");
                    navigate("/WeeklyPlanPage", {
                      state: {
                        selectedIdea: {
                          ...selectedIdea,
                          version: item.version,
                          platform: item.platform,
                          type: item.format,
                          hook: item.hook,
                          angle: item.angle,
                          painPoint: item.painPoint,
                        },
                        onboardingData,
                      },
                    });
                  }
                }
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(251,146,60,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(244,124,53,0.45)]"
              >
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
