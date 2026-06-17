import { motion } from "framer-motion";

function OnboardingHeader({
  currentStep = 1,
  totalSteps = 7,
}) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  const stepData = [
    {
      title: "Brand Basics",
      description:
        "Tell us about your brand so we can build a high-performing content strategy tailored to your growth.",
    },
    {
      title: "Target Audience",
      description:
        "Define your ideal audience so we can create content that attracts and converts the right people.",
    },
    {
      title: "Business Goals",
      description:
        "Set clear goals so we can align your content with measurable growth outcomes.",
    },
    {
      title: "Brand Voice",
      description:
        "Shape how your brand sounds so your content feels consistent and recognizable.",
    },
    {
      title: "Content Preferences",
      description:
        "Choose formats and platforms to match your audience behavior and maximize reach.",
    },
    {
      title: "Keywords",
      description:
        "Add strategic keywords so your content performs better in search and discovery.",
    },
    {
      title: "Challenges",
      description:
        "Tell us your current challenges so we can generate a smarter, more effective plan.",
    },
  ];

  const { title, description } = stepData[currentStep - 1];

  return (
    <div className="relative mb-12">
      {/* TOP PROGRESS BAR (Premium SaaS feel) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--app-border)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
        />
      </div>

      <div className="relative flex flex-col gap-8 md:flex-row md:items-start justify-between pt-6">
        {/* LEFT CONTENT */}
        <div className="max-w-2xl">
          {/* STEP BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-full border border-orange-500/20">
              Step {currentStep} of {totalSteps}
            </span>

            <span className="text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-widest opacity-60">
              {progress}% completed
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--app-text)] tracking-tight"
          >
            {title}
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            key={description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-[var(--muted-text)] font-medium leading-relaxed"
          >
            {description}
          </motion.p>

          {/* AI TAG (Important SaaS touch) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center gap-2 text-sm text-orange-500 font-bold"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            AI is generating your personalized strategy in real-time
          </motion.div>
        </div>

        {/* RIGHT PROGRESS CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex"
        >
          <div className="w-28 h-28 rounded-[28px] bg-[var(--card-bg)] border border-[var(--app-border)] shadow-sm flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 hover:border-orange-500/30">

            {/* Glow hover */}
            <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

            {/* Circle progress */}
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                className="text-[var(--app-border)]"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                stroke="url(#gradient-header)"
                strokeWidth="6"
                fill="none"
                strokeDasharray="301"
                strokeDashoffset={301 - (progress / 100) * 301}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient-header">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </svg>

            {/* TEXT */}
            <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest relative z-10 opacity-60">
              Progress
            </span>
            <span className="text-2xl font-black text-[var(--app-text)] relative z-10">
              {progress}%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OnboardingHeader;