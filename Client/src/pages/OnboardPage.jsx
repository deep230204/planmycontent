import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import OnboardingSidebar from "../components/Branding/onboarding/OnboardingSidebar";
import OnboardingHeader from "../components/Branding/onboarding/OnboardingHeader";

import BrandBasic from "../components/Branding/onboarding/BrandBasic";
import TargetAudience from "../components/Branding/onboarding/TargetAudience";
import BusinessGoals from "../components/Branding/onboarding/BusinessGoals";
import BrandVoice from "../components/Branding/onboarding/BrandVoice";
import ContentPreferences from "../components/Branding/onboarding/ContentPreferences";
import Keywords from "../components/Branding/onboarding/Keywords";
import Challenges from "../components/Branding/onboarding/Challenges";
import NavigationButtons from "../components/Branding/onboarding/NavigationButtons";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import {
  clearLegacyOnboardingDrafts,
  clearOnboardingDraft,
  getEmptyOnboardingForm,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../utils/onboardingDraft";

function OnboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );

  const [formData, setFormData] = useState(getEmptyOnboardingForm);

  useEffect(() => {
    clearLegacyOnboardingDrafts();

    if (!user?.email) {
      setFormData(getEmptyOnboardingForm());
      return;
    }

    if (location.state?.freshStart) {
      clearOnboardingDraft(user.email);
      localStorage.removeItem("latestOnboardingData");
      localStorage.removeItem("latestGeneratedResults");
      setCurrentStep(1);
      setFormData(getEmptyOnboardingForm());
      return;
    }

    const draft = loadOnboardingDraft(user.email);
    if (draft) {
      setFormData({ ...getEmptyOnboardingForm(), ...draft });
      return;
    }

    setFormData(getEmptyOnboardingForm());
  }, [location.state, user]);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    saveOnboardingDraft(user.email, formData);
  }, [formData, user]);

  const nextStep = () => {
    if (currentStep < 7) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinishOnboarding = async (finalChallenges) => {
    try {
      if (!user || !user.email) {
        alert("User not found. Please login again.");
        return;
      }

      const onboardingData = {
        ...formData.brandBasic,
        audience: formData.audience,
        goals: formData.goals,
        voice: formData.voice,
        contentType: formData.content,
        keywords: formData.keywords,
        challenges: finalChallenges || formData.challenges,
      };

      const res = await fetch("https://planmycontent.onrender.com/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          onboardingData,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (!data.success) {
        alert("Something went wrong");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("latestOnboardingData", JSON.stringify(onboardingData));
      localStorage.removeItem("latestGeneratedResults");
      clearOnboardingDraft(user.email);

      navigate("/LoadingPage", { state: { onboardingData } });
    } catch (error) {
      console.error("ERROR:", error);
      alert("Error connecting to server");
    }
  };

  const stepComponents = {
    1: <BrandBasic formData={formData} setFormData={setFormData} />,
    2: <TargetAudience formData={formData} setFormData={setFormData} />,
    3: <BusinessGoals formData={formData} setFormData={setFormData} />,
    4: <BrandVoice formData={formData} setFormData={setFormData} />,
    5: <ContentPreferences formData={formData} setFormData={setFormData} />,
    6: <Keywords formData={formData} setFormData={setFormData} />,
    7: (
      <Challenges
        onBack={prevStep}
        onFinish={handleFinishOnboarding}
        formData={formData}
        setFormData={setFormData}
      />
    ),
  };

  return (
    <WorkspaceShell
      badge={`Onboarding Step ${currentStep} of 7`}
      section="Onboarding"
      title="Build your premium content engine"
      description="Shape your brand, audience, and content direction in one guided workspace so every idea and weekly plan feels more strategic."
      backTo="/dashboard"
      backLabel="Dashboard"
    >
      <div className="relative overflow-hidden rounded-[44px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-orange-500/5 dark:bg-orange-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[340px_1fr]">
          <OnboardingSidebar currentStep={currentStep} />

          <main className="relative">
            <div className="glass-card flex min-h-[700px] flex-col rounded-[44px] p-8 md:p-12 border border-[var(--app-border)]">
              <OnboardingHeader currentStep={currentStep} totalSteps={7} />

              <div className="mt-12 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {stepComponents[currentStep]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {currentStep !== 7 && (
                <NavigationButtons
                  currentStep={currentStep}
                  totalSteps={7}
                  onNext={nextStep}
                  onBack={prevStep}
                  formData={formData}
                />
              )}
            </div>

            <div className="absolute -right-6 -top-6 -z-10 h-24 w-24 rounded-full bg-orange-500/10 blur-xl animate-pulse" />
            <div
              className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </main>
        </div>
      </div>
    </WorkspaceShell>
  );
}

export default OnboardPage;
