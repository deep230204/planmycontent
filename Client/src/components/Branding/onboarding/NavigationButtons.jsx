import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function NavigationButtons({
  currentStep = 1,
  totalSteps = 7,
  onBack,
  onNext,
  isLoading = false,
  formData = {},
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const isStepValid = () => {
    try {
      if (!formData) return false;

      switch (currentStep) {
        case 1: // Brand Basic
          return (
            formData.brandBasic?.brandName?.trim() &&
            formData.brandBasic?.industry?.length > 0
          );
        case 2: // Target Audience
          return (
            formData.audience?.profession &&
            formData.audience?.audienceType
          );
        case 3: // Business Goals
          return formData.goals?.primaryGoal;
        case 4: // Brand Voice
          return (
            (formData.voice?.personality?.length > 0 || formData.voice?.customPersonality) &&
            (formData.voice?.tone || formData.voice?.customTone)
          );
        case 5: // Content Preferences
          return (
            formData.content?.platforms?.length > 0 &&
            formData.content?.contentTypes?.length > 0 &&
            formData.content?.postingFrequency
          );
        case 6: // Keywords
          // Keywords can stay optional for flexibility
          return true;
        default:
          return true;
      }
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const isDisabled = isLoading || !isStepValid();

  return (
    <div className="mt-12 pt-10 border-t border-[var(--app-border)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className={`flex h-14 items-center justify-center gap-2 rounded-2xl border-2 px-8 text-sm font-black transition-all active:scale-95 ${
            isFirstStep
              ? "border-[var(--app-border)] bg-[var(--soft-bg)] text-[var(--muted-text)] opacity-30 cursor-not-allowed"
              : "border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] hover:bg-[var(--soft-bg)] hover:border-orange-500/30"
          }`}
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <p className="text-center text-xs font-bold text-[var(--muted-text)] uppercase tracking-widest italic opacity-60">
          Progress is auto-saved
        </p>

        <button
          type="button"
          onClick={onNext}
          disabled={isDisabled}
          className={`group flex h-14 min-w-[200px] items-center justify-center gap-3 rounded-2xl px-10 text-sm font-black text-white shadow-lg transition-all active:scale-95 ${
            isDisabled
              ? "bg-[var(--soft-bg)] text-[var(--muted-text)] opacity-40 cursor-not-allowed shadow-none"
              : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isLastStep ? "Launch Strategy 🚀" : "Continue →"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default NavigationButtons;