import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  GENERATED_RESULTS_KEY,
  REFINED_RESULTS_KEY,
  readIdeasPayload,
  writeIdeasPayload,
} from "../utils/resultStorage";

function UpdatedLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const onboardingData =
    location.state?.onboardingData ||
    JSON.parse(localStorage.getItem("latestOnboardingData") || "null");
  const currentIdeas =
    location.state?.currentIdeas ||
    readIdeasPayload(GENERATED_RESULTS_KEY)?.ideas ||
    [];
  const refinementText = location.state?.refinementText || "";
  const selectedMood = location.state?.selectedMood || "";

  const loadingSteps = [
    {
      title: "Analyzing your existing content...",
      description:
        "We are reviewing your current ideas, messaging, and platform fit.",
    },
    {
      title: "Applying your refinement feedback...",
      description:
        "We are using your selected mood and custom feedback to guide the next result set.",
    },
    {
      title: "Regenerating stronger content ideas...",
      description:
        "We are creating a sharper set of AI ideas with better hooks and more relevant angles.",
    },
    {
      title: "Optimizing for your audience...",
      description:
        "We are tailoring every updated idea to your audience, goals, and chosen formats.",
    },
    {
      title: "Finalizing your updated result...",
      description:
        "We are preparing your regenerated content ideas page with the latest AI output.",
    },
  ];

  useEffect(() => {
    let isActive = true;

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2200);

    const runRefinement = async () => {
      if (!onboardingData) {
        toast.error("Missing onboarding data. Please generate your strategy again.");
        navigate("/ResultPage");
        return;
      }

      const minimumDelay = new Promise((resolve) => {
        setTimeout(resolve, 12000);
      });

      const generationPromise = fetch("http://localhost:5000/api/auth/generate-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onboardingData,
          options: {
            ideaCount: 10,
            feedback: refinementText,
            selectedMood,
            currentIdeas: currentIdeas.slice(0, 10),
            excludeTitles: currentIdeas.map((idea) => idea?.title).filter(Boolean),
          },
        }),
      })
        .then(async (response) => {
          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(data?.message || "Failed to refine content ideas");
          }

          if (!data?.results || !Array.isArray(data.results.ideas)) {
            throw new Error("Invalid refined results payload received from server");
          }

          return data.results;
        })
        .catch((error) => {
          console.error("Update loading generation error:", error);
          return null;
        });

      const [, generatedResults] = await Promise.all([
        minimumDelay,
        generationPromise,
      ]);

      if (!isActive) {
        return;
      }

      if (!generatedResults || !Array.isArray(generatedResults.ideas) || generatedResults.ideas.length === 0) {
        toast.error("AI refinement failed. Please try again.");
        navigate("/RefinementPage", {
          state: {
            onboardingData,
            currentIdeas,
          },
        });
        return;
      }

      writeIdeasPayload(REFINED_RESULTS_KEY, generatedResults);
      localStorage.setItem("latestRefinementText", refinementText);
      localStorage.setItem("latestRefinementMood", selectedMood);

      navigate("/UpdateResultPage", {
        state: {
          onboardingData,
          generatedResults,
          refinementText,
          selectedMood,
        },
      });
    };

    runRefinement();

    return () => {
      isActive = false;
      clearInterval(stepInterval);
    };
  }, [navigate, onboardingData, currentIdeas, refinementText, selectedMood]);

  const progressPct = Math.round(((currentStep + 1) / loadingSteps.length) * 100);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10"
      style={{ background: "var(--app-bg)" }}>
      
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[40px] px-8 py-14 md:px-14 md:py-16"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--app-border)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Inner gradient overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(ellipse_at_top_right,rgba(244,124,53,0.06),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.06),transparent_60%)]" />

        <div className="relative flex flex-col items-center text-center">

          {/* ── Orbital Spinner ── */}
          <div className="relative mb-8 animate-[loading_float_4s_ease-in-out_infinite]">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 scale-150 rounded-full bg-orange-500/20 blur-3xl" />

            {/* Outermost ring */}
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-orange-500/10" />
              <div className="absolute inset-0 animate-[spin_8s_linear_infinite_reverse] rounded-full border border-dashed border-orange-500/20" />
              
              {/* Middle ring */}
              <div className="absolute inset-3 animate-[spin_4s_linear_infinite] rounded-full border-2 border-dashed border-orange-500/30" />
              
              {/* Inner glowing ring */}
              <div className="absolute inset-6 rounded-full"
                style={{ boxShadow: "0 0 30px rgba(244,124,53,0.25)" }}>
                <div className="h-full w-full animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500"
                  style={{ animationDuration: "1.2s" }} />
              </div>

              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-orange-500"
                  style={{ boxShadow: "0 0 20px rgba(244,124,53,0.8), 0 0 40px rgba(244,124,53,0.4)" }} />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mb-6 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{
              borderColor: "rgba(244,124,53,0.3)",
              background: "rgba(244,124,53,0.08)",
              color: "#fb923c",
            }}>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
            AI Content Refiner
          </div>

          {/* Step text */}
          <div key={currentStep} className="animate-[loadingFadeIn_0.6s_ease]">
            <h1 className="mx-auto max-w-lg text-3xl font-black leading-tight tracking-tight md:text-4xl"
              style={{ color: "var(--app-text)" }}>
              {loadingSteps[currentStep].title}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7"
              style={{ color: "var(--muted-text)" }}>
              {loadingSteps[currentStep].description}
            </p>
          </div>

          {/* Step dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {loadingSteps.map((_, index) => (
              <div
                key={index}
                className="rounded-full transition-all duration-500"
                style={{
                  height: "10px",
                  width: index === currentStep ? "36px" : index < currentStep ? "20px" : "10px",
                  background: index === currentStep
                    ? "#f97316"
                    : index < currentStep
                      ? "rgba(249,115,22,0.4)"
                      : "var(--app-border)",
                  boxShadow: index === currentStep ? "0 0 12px rgba(249,115,22,0.6)" : "none",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-10 w-full max-w-sm">
            <div className="mb-2 flex items-center justify-between text-xs font-bold"
              style={{ color: "var(--muted-text)" }}>
              <span>Step {currentStep + 1} of {loadingSteps.length}</span>
              <span style={{ color: "#fb923c" }}>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--app-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(to right, #ea580c, #f97316, #fb923c)",
                  boxShadow: "0 0 12px rgba(249,115,22,0.5)",
                }}
              />
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Better Hook", color: "#f97316", bg: "rgba(249,115,22,0.06)" },
              { label: "Sharper Angle", color: "#3b82f6", bg: "rgba(59,130,246,0.06)" },
              { label: "More Engagement", color: "#22c55e", bg: "rgba(34,197,94,0.06)" }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl px-4 py-2 text-xs font-semibold"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.color}20`,
                  color: "var(--muted-text)",
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loadingFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadingFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .animate-\\[loading_float_4s_ease-in-out_infinite\\] {
          animation: loadingFloat 4s ease-in-out infinite;
        }
        .animate-\\[loadingFadeIn_0\\.6s_ease\\] {
          animation: loadingFadeIn 0.6s ease both;
        }
      `}</style>
    </div>
  );
}

export default UpdatedLoadingPage;
