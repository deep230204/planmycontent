import React, { useState } from "react";
import {
  Eye,
  Users,
  DollarSign,
  MessageCircle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BusinessGoals({ formData, setFormData }) {
  const data = {
    primaryGoal: [],
    ...(formData.goals || {}),
  };

  const selectedGoals = data.primaryGoal;

  const goals = [
    {
      title: "Awareness",
      description: "Increase brand visibility and reach a wider audience.",
      icon: Eye,
    },
    {
      title: "Leads",
      description: "Attract qualified leads and drive inquiries.",
      icon: Users,
    },
    {
      title: "Sales",
      description: "Convert visitors into loyal paying customers.",
      icon: DollarSign,
    },
    {
      title: "Community",
      description: "Build trust and engagement with your followers.",
      icon: MessageCircle,
    },
    {
      title: "Education",
      description: "Position yourself as an authority in your niche.",
      icon: BookOpen,
    },
    {
      title: "Growth",
      description: "Scale your business and expand into new markets.",
      icon: TrendingUp,
    },
  ];

  const toggleGoal = (goal) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter((item) => item !== goal)
      : [...selectedGoals, goal];

    const newData = { ...data, primaryGoal: updated };
    setFormData((prev) => ({ ...prev, goals: newData }));
  };

  const [customGoal, setCustomGoal] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomAdd = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      toggleGoal(customGoal.trim());
      setCustomGoal("");
      setShowCustom(false);
    }
  };

  const chipStyles = "flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] transition-all duration-300 hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95";
  const activeChipStyles = "flex items-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 active:scale-95";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.title);

          return (
            <motion.button
              key={goal.title}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleGoal(goal.title)}
              className={`group relative flex flex-col overflow-hidden rounded-[32px] border-2 p-8 text-left transition-all duration-500 ${
                isSelected
                  ? "border-orange-500 bg-[var(--card-bg)] dark:bg-orange-500/5 shadow-[var(--shadow-premium)]"
                  : "border-[var(--app-border)] bg-[var(--card-bg)] hover:border-orange-500/30 hover:shadow-[var(--shadow-premium)]"
              }`}
            >
              {isSelected ? (
                <div className="absolute right-6 top-6">
                  <CheckCircle2 className="h-6 w-6 text-orange-500" />
                </div>
              ) : null}

              <div
                className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${
                  isSelected
                    ? "scale-110 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-[var(--soft-bg)] text-[var(--muted-text)] group-hover:bg-orange-500/10 group-hover:text-orange-500"
                }`}
              >
                <Icon size={24} />
              </div>

              <h3
                className={`text-xl font-black tracking-tight transition-colors duration-300 ${
                  isSelected ? "text-[var(--app-text)]" : "text-[var(--app-text)] opacity-70"
                }`}
              >
                {goal.title}
              </h3>

              <p
                className={`mt-3 text-sm font-medium leading-6 transition-colors duration-300 ${
                  isSelected ? "text-[var(--muted-text)]" : "text-[var(--muted-text)] opacity-60"
                }`}
              >
                {goal.description}
              </p>

              {isSelected ? (
                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl" />
              ) : null}
            </motion.button>
          );
        })}
      </div>

      {/* Custom Goals Area */}
      <div className="mt-8 flex flex-wrap gap-3">
        {selectedGoals.filter(g => !goals.map(o => o.title).includes(g)).map(g => (
          <button
            key={g}
            type="button"
            onClick={() => toggleGoal(g)}
            className={activeChipStyles}
          >
            <span>{g}</span>
            <X size={14} className="opacity-70" />
          </button>
        ))}

        <AnimatePresence>
          {showCustom ? (
            <motion.div
              initial={{ opacity: 0, w: 0 }}
              animate={{ opacity: 1, w: "auto" }}
              exit={{ opacity: 0, w: 0 }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                placeholder="Enter custom goal..."
                className="rounded-xl border border-orange-500/30 bg-[var(--card-bg)] px-4 py-2.5 text-sm font-bold text-[var(--app-text)] outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleCustomAdd}
                className="rounded-xl bg-orange-500 p-2.5 text-white"
              >
                <Plus size={16} />
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} /> Other Goal
            </button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-orange-500/10 bg-orange-500/5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white">
          !
        </div>
        <p className="text-sm font-bold italic text-[var(--app-text)] opacity-70">
          Pro Tip: Selecting 2-3 focused goals helps our AI generate a more cohesive strategy.
        </p>
      </div>
    </motion.div>
  );
}

export default BusinessGoals;
