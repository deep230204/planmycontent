import {
  Lightbulb,
  Clock3,
  TrendingDown,
  FileText,
  ArrowLeft,
  ArrowRight,
  Wrench,
  Users2,
  Trophy,
  AlertCircle,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Challenges({ formData, setFormData, onBack, onFinish }) {
  const initialData = useMemo(
    () => ({
      challenges: [],
      tools: [],
      teamSize: "",
      confidence: "",
      frustration: "",
      ...(formData.challenges || {}),
    }),
    [formData.challenges]
  );

  const [selectedChallenges, setSelectedChallenges] = useState(
    initialData.challenges
  );
  const [selectedTools, setSelectedTools] = useState(initialData.tools);
  const [teamSize, setTeamSize] = useState(initialData.teamSize);
  const [confidence, setConfidence] = useState(initialData.confidence);
  const [frustration, setFrustration] = useState(initialData.frustration);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenges = [
    { title: "Lack of Ideas", icon: Lightbulb },
    { title: "Inconsistent Posting", icon: Clock3 },
    { title: "Low Engagement", icon: TrendingDown },
    { title: "Difficulty Writing", icon: FileText },
  ];

  const tools = [
    "Canva",
    "ChatGPT",
    "Notion",
    "Google Docs",
    "Buffer",
    "Hootsuite",
  ];

  const syncChallenges = (updatedFields) => {
    setFormData((prev) => ({
      ...prev,
      challenges: {
        challenges: selectedChallenges,
        tools: selectedTools,
        teamSize,
        confidence,
        frustration,
        ...updatedFields,
      },
    }));
  };

  const toggleChallenge = (challenge) => {
    const updated = selectedChallenges.includes(challenge)
      ? selectedChallenges.filter((item) => item !== challenge)
      : [...selectedChallenges, challenge];
    setSelectedChallenges(updated);
    syncChallenges({ challenges: updated });
  };

  const toggleTool = (tool) => {
    const updated = selectedTools.includes(tool)
      ? selectedTools.filter((item) => item !== tool)
      : [...selectedTools, tool];
    setSelectedTools(updated);
    syncChallenges({ tools: updated });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const finalChallenges = {
      challenges: selectedChallenges,
      tools: selectedTools,
      teamSize,
      confidence,
      frustration,
    };
    syncChallenges(finalChallenges);
    if (onFinish) {
      onFinish(finalChallenges);
    }
    setIsSubmitting(false);
  };

  const [customTool, setCustomTool] = useState("");
  const [showCustomTool, setShowCustomTool] = useState(false);
  const [customChallenge, setCustomChallenge] = useState("");
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);

  const handleCustomToolAdd = () => {
    if (customTool.trim() && !selectedTools.includes(customTool.trim())) {
      toggleTool(customTool.trim());
      setCustomTool("");
      setShowCustomTool(false);
    }
  };

  const handleCustomChallengeAdd = () => {
    if (customChallenge.trim() && !selectedChallenges.includes(customChallenge.trim())) {
      toggleChallenge(customChallenge.trim());
      setCustomChallenge("");
      setShowCustomChallenge(false);
    }
  };

  const chipStyles =
    "flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] transition-all duration-300 hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95";
  const activeChipStyles =
    "flex items-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 active:scale-95";
  const inputStyles =
    "w-full rounded-2xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-4 text-[15px] text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none transition-all duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(244,124,53,0.1)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="space-y-6">
        <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          Primary Obstacles
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            const isSelected = selectedChallenges.includes(challenge.title);
            return (
              <button
                key={challenge.title}
                type="button"
                onClick={() => toggleChallenge(challenge.title)}
                className={`group flex items-center gap-4 rounded-3xl border-2 p-5 text-left transition-all duration-500 ${
                  isSelected
                    ? "border-orange-500 bg-[var(--card-bg)] dark:bg-orange-500/5 shadow-[var(--shadow-premium)]"
                    : "border-[var(--app-border)] bg-[var(--card-bg)] hover:border-orange-500/20 hover:shadow-[var(--shadow-premium)]"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                    isSelected
                      ? "bg-orange-500 text-white"
                      : "bg-[var(--soft-bg)] text-[var(--muted-text)]"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <h3
                  className={`text-base font-black transition-colors duration-300 ${
                    isSelected ? "text-[var(--app-text)]" : "text-[var(--app-text)] opacity-70"
                  }`}
                >
                  {challenge.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Custom Challenges */}
        <div className="flex flex-wrap gap-3 mt-4">
          {selectedChallenges.filter(c => !challenges.map(o => o.title).includes(c)).map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggleChallenge(c)}
              className={activeChipStyles}
            >
              <span>{c}</span>
              <X size={14} className="opacity-70" />
            </button>
          ))}
          <AnimatePresence>
            {showCustomChallenge ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomChallengeAdd()}
                  placeholder="Custom obstacle..."
                  className="rounded-xl border border-orange-500/30 bg-[var(--card-bg)] px-4 py-2.5 text-sm font-bold text-[var(--app-text)] outline-none focus:border-orange-500"
                />
                <button type="button" onClick={handleCustomChallengeAdd} className="rounded-xl bg-orange-500 p-2.5 text-white">
                  <Plus size={16} />
                </button>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomChallenge(true)}
                className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
              >
                <Plus size={16} /> Other
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
          <Wrench className="h-4 w-4 text-orange-500" />
          Current Ecosystem
        </label>
        <div className="flex flex-wrap gap-3">
          {tools.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => toggleTool(tool)}
              className={selectedTools.includes(tool) ? activeChipStyles : chipStyles}
            >
              {tool}
            </button>
          ))}

          {/* Custom Tools */}
          {selectedTools.filter(t => !tools.includes(t)).map(t => (
            <button key={t} type="button" onClick={() => toggleTool(t)} className={activeChipStyles}>
              <span>{t}</span>
              <X size={14} className="opacity-70" />
            </button>
          ))}

          <AnimatePresence>
            {showCustomTool ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={customTool}
                  onChange={(e) => setCustomTool(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomToolAdd()}
                  placeholder="Custom tool..."
                  className="rounded-xl border border-orange-500/30 bg-[var(--card-bg)] px-4 py-2.5 text-sm font-bold text-[var(--app-text)] outline-none focus:border-orange-500"
                />
                <button type="button" onClick={handleCustomToolAdd} className="rounded-xl bg-orange-500 p-2.5 text-white">
                  <Plus size={16} />
                </button>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomTool(true)}
                className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
              >
                <Plus size={16} /> Other
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <Users2 className="h-4 w-4 text-orange-500" />
            Team Composition
          </label>
          <div className="relative">
            <select
              value={teamSize}
              onChange={(e) => {
                setTeamSize(e.target.value);
                syncChallenges({ teamSize: e.target.value });
              }}
              className={`${inputStyles} appearance-none cursor-pointer bg-[var(--card-bg)] pr-12`}
            >
              <option value="">Select Team Size</option>
              <option>Solo</option>
              <option>2-5 People</option>
              <option>6-10 People</option>
              <option>10+ People</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none h-5 w-5 text-[var(--muted-text)] opacity-60" />
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <Trophy className="h-4 w-4 text-orange-500" />
            Experience Level
          </label>
          <div className="relative">
            <select
              value={confidence}
              onChange={(e) => {
                setConfidence(e.target.value);
                syncChallenges({ confidence: e.target.value });
              }}
              className={`${inputStyles} appearance-none cursor-pointer bg-[var(--card-bg)] pr-12`}
            >
              <option value="">Select Experience Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none h-5 w-5 text-[var(--muted-text)] opacity-60" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
          Major Pain Point
        </label>
        <textarea
          rows="4"
          value={frustration}
          onChange={(e) => {
            setFrustration(e.target.value);
            syncChallenges({ frustration: e.target.value });
          }}
          placeholder="What's the #1 thing holding you back?"
          className={`${inputStyles} resize-none`}
        />
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-orange-500/10 bg-orange-500/5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white">
          ?
        </div>
        <p className="text-sm font-bold italic text-[var(--app-text)] opacity-70">
          Finalizing these details allows us to tailor the execution plans to your specific bandwidth and skill level.
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-[var(--app-border)] pt-10 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--app-border)] px-8 text-sm font-black text-[var(--muted-text)] hover:bg-[var(--soft-bg)] transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedChallenges.length === 0}
          className={`flex h-14 min-w-[240px] items-center justify-center gap-3 rounded-2xl px-10 text-sm font-black text-white shadow-lg transition-all active:scale-95 ${
            selectedChallenges.length === 0
              ? "bg-[var(--soft-bg)] text-[var(--muted-text)] opacity-40 cursor-not-allowed shadow-none"
              : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          {isSubmitting ? "Generating Strategy..." : "Launch Strategy"}
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export default Challenges;
