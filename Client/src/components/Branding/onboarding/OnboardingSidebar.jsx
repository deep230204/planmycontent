import { motion, AnimatePresence } from "framer-motion";
import logo1 from "../../../assets/logo1.png";

function OnboardingSidebar({ currentStep = 1 }) {
  const steps = [
    "Brand Basic",
    "Target Audience",
    "Business Goals",
    "Brand Voice",
    "Content Preferences",
    "Keywords",
    "Challenges",
  ];

  const progress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="hidden lg:block relative overflow-hidden rounded-[40px] border border-[var(--app-border)] bg-[var(--card-bg)] backdrop-blur-3xl p-8 shadow-premium h-fit sticky top-8 transition-all duration-500">
      
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <img
            src={logo1}
            alt="Logo"
            className="w-10 h-10 object-contain flex-shrink-0 rounded-xl bg-white p-1 shadow-sm border border-slate-200/10"
          />
          <span className="text-2xl font-extrabold text-[var(--app-text)] tracking-tight">
            PlanMy<span className="text-[#f47c35]">Content</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
            Guided Onboarding
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-[32px] font-black leading-[1.1] text-[var(--app-text)] tracking-tight"
        >
          Build your <span className="text-orange-500 italic font-serif">strategy</span> step by step
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm leading-6 text-[var(--muted-text)] font-medium opacity-80"
        >
          Follow our intelligent guide to craft a personalized content engine tailored to your brand.
        </motion.p>

        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 rounded-[28px] border border-[var(--app-border)] bg-[var(--soft-bg)] p-6 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="mb-4 flex items-center justify-between text-[13px] font-bold relative z-10">
            <span className="text-[var(--muted-text)] opacity-80">
              Step <span className="text-[var(--app-text)]">{currentStep}</span> of {steps.length}
            </span>
            <span className="text-orange-500 font-black">
              {progress}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--app-border)] relative z-10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 shadow-[0_0_15px_rgba(244,124,53,0.4)]"
            />
          </div>
        </motion.div>

        {/* Steps List */}
        <div className="mt-10 space-y-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className={`relative rounded-2xl border px-5 py-3.5 text-[13px] font-bold transition-all duration-500 ${
                  isActive
                    ? "border-orange-500/30 bg-[var(--soft-bg)] shadow-lg shadow-orange-500/5 text-[var(--app-text)]"
                    : isCompleted
                    ? "border-transparent bg-orange-500/5 text-orange-500/70"
                    : "border-transparent text-[var(--muted-text)] opacity-40 hover:opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black transition-all duration-500 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-orange-500/40 shadow-lg scale-110"
                        : isCompleted
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-[var(--app-border)] text-[var(--muted-text)]"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>

                  <span className={`tracking-tight transition-colors duration-500 ${isActive ? 'text-[var(--app-text)] font-black' : ''}`}>
                    {step}
                  </span>

                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(244,124,53,0.8)]"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OnboardingSidebar;