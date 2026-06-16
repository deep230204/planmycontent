import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag, Users, ShieldAlert, Target, X, Plus } from "lucide-react";

function Keywords({ formData, setFormData }) {
  const data = {
    primary: [],
    secondary: [],
    topics: [],
    seoGoals: [],
    competitor: "",
    focus: "",
    avoid: "",
    ...(formData.keywords || {}),
  };

  const [inputPrimary, setInputPrimary] = useState("");
  const [inputSecondary, setInputSecondary] = useState("");

  const primaryKeywords = data.primary;
  const secondaryKeywords = data.secondary;
  const selectedTopics = data.topics;
  const selectedSEOGoals = data.seoGoals;

  const updateKeywords = (updatedFields) => {
    const updated = { ...data, ...updatedFields };
    setFormData((prev) => ({ ...prev, keywords: updated }));
  };

  const handleAddKeyword = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value) return;
      if (type === "primary") {
        updateKeywords({ primary: [...primaryKeywords, value] });
        setInputPrimary("");
      } else {
        updateKeywords({ secondary: [...secondaryKeywords, value] });
        setInputSecondary("");
      }
    }
  };

  const removeKeyword = (type, keyword) => {
    const updated = type === "primary"
      ? primaryKeywords.filter((k) => k !== keyword)
      : secondaryKeywords.filter((k) => k !== keyword);
    updateKeywords({ [type]: updated });
  };

  const toggleSelection = (field, value) => {
    const current = data[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateKeywords({ [field]: updated });
  };

  const [customTopic, setCustomTopic] = useState("");
  const [showCustomTopic, setShowCustomTopic] = useState(false);
  const [customSEOGoal, setCustomSEOGoal] = useState("");
  const [showCustomSEOGoal, setShowCustomSEOGoal] = useState(false);

  const handleCustomTopicAdd = () => {
    if (customTopic.trim() && !selectedTopics.includes(customTopic.trim())) {
      toggleSelection("topics", customTopic.trim());
      setCustomTopic("");
      setShowCustomTopic(false);
    }
  };

  const handleCustomSEOGoalAdd = () => {
    if (customSEOGoal.trim() && !selectedSEOGoals.includes(customSEOGoal.trim())) {
      toggleSelection("seoGoals", customSEOGoal.trim());
      setCustomSEOGoal("");
      setShowCustomSEOGoal(false);
    }
  };

  const chipStyles = "flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] transition-all duration-300 hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95";
  const activeChipStyles = "flex items-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 active:scale-95";
  const inputStyles = "w-full rounded-2xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-4 text-[15px] text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none transition-all duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(244,124,53,0.1)]";

  const industry = formData.brandBasic?.industry || [];
  const industryStr = Array.isArray(industry) ? industry.join(" ") : industry;

  const getSuggestedKeywords = () => {
    const suggestions = {
      Fitness: ["Workout Plans", "Weight Loss", "Healthy Living", "Personal Training", "Nutrition Tips", "Gym Motivation"],
      SaaS: ["Cloud Solutions", "Productivity Tools", "Automation", "Software Integration", "User Experience", "Enterprise Software"],
      Finance: ["Investment Tips", "Budgeting", "Personal Finance", "Stock Market", "Savings Strategy", "Cryptocurrency"],
      "E-commerce": ["Online Shopping", "Retail Trends", "Direct to Consumer", "Product Reviews", "Customer Experience", "Sustainable Fashion"],
      Creator: ["Content Creation", "Monetization", "Brand Deals", "Audience Growth", "Editing Tips", "Influencer Marketing"],
      Education: ["E-learning", "Skill Development", "Study Tips", "Career Advice", "Online Courses", "Educational Resources"],
    };

    // Find the first matching industry or return defaults
    const matchingKey = Object.keys(suggestions).find(key => industryStr.includes(key));
    return suggestions[matchingKey] || ["Social Media", "Marketing Strategy", "Digital Growth", "Success Tips"];
  };

  const suggestedKeywords = getSuggestedKeywords();

  const topicOptions = ["Branding", "Content Strategy", "SEO", "Social Media", "Email Marketing", "Personal Branding", "AI Tools"];
  const seoGoalOptions = ["Brand Awareness", "Website Traffic", "Lead Generation", "Engagement"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 flex items-center gap-2 uppercase tracking-wider">
            <Search className="w-4 h-4 text-orange-500" />
            Primary Focus Keywords
          </label>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] opacity-60">Suggestions:</span>
            {suggestedKeywords.filter(k => !primaryKeywords.includes(k)).map(keyword => (
              <button
                key={keyword}
                onClick={() => updateKeywords({ primary: [...primaryKeywords, keyword] })}
                className="px-2 py-0.5 rounded-full border border-[var(--app-border)] bg-[var(--card-bg)] text-[10px] font-bold text-[var(--muted-text)] hover:border-orange-500/40 hover:text-orange-500 transition-all active:scale-95"
              >
                + {keyword}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl border-2 border-[var(--app-border)] bg-[var(--soft-bg)] focus-within:border-orange-500/30 focus-within:bg-[var(--card-bg)] dark:focus-within:bg-slate-800 transition-all duration-300">
          {primaryKeywords.map((keyword) => (
            <motion.span 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              key={keyword} 
              className="flex items-center gap-2 rounded-xl bg-orange-500 text-white px-3 py-1.5 text-xs font-black shadow-sm"
            >
              {keyword}
              <button onClick={() => removeKeyword("primary", keyword)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                <X size={12} />
              </button>
            </motion.span>
          ))}
          <input
            value={inputPrimary}
            onChange={(e) => setInputPrimary(e.target.value)}
            onKeyDown={(e) => handleAddKeyword(e, "primary")}
            placeholder="Add keyword..."
            className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[var(--muted-text)] opacity-60 text-[var(--app-text)]"
          />
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 flex items-center gap-2 uppercase tracking-wider">
          <Tag className="w-4 h-4 text-orange-500" />
          Secondary Keywords
        </label>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl border-2 border-[var(--app-border)] bg-[var(--soft-bg)] focus-within:border-orange-500/30 focus-within:bg-[var(--card-bg)] dark:focus-within:bg-slate-800 transition-all duration-300">
          {secondaryKeywords.map((keyword) => (
            <motion.span 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              key={keyword} 
              className="flex items-center gap-2 rounded-xl bg-[var(--app-border)] text-[var(--app-text)] px-3 py-1.5 text-xs font-black shadow-sm"
            >
              {keyword}
              <button onClick={() => removeKeyword("secondary", keyword)} className="hover:bg-white/10 rounded-full p-0.5 transition-colors">
                <X size={12} />
              </button>
            </motion.span>
          ))}
          <input
            value={inputSecondary}
            onChange={(e) => setInputSecondary(e.target.value)}
            onKeyDown={(e) => handleAddKeyword(e, "secondary")}
            placeholder="Add keyword..."
            className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[var(--muted-text)] opacity-60 text-[var(--app-text)]"
          />
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">Strategic Content Topics</label>
        <div className="flex flex-wrap gap-3">
          {topicOptions.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleSelection("topics", topic)}
              className={selectedTopics.includes(topic) ? activeChipStyles : chipStyles}
            >
              {topic}
            </button>
          ))}

          {/* Custom Topics */}
          {selectedTopics.filter(t => !topicOptions.includes(t)).map(t => (
            <button key={t} type="button" onClick={() => toggleSelection("topics", t)} className={activeChipStyles}>
              <span>{t}</span>
              <X size={14} className="opacity-70" />
            </button>
          ))}

          <AnimatePresence>
            {showCustomTopic ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomTopicAdd()}
                  placeholder="Custom topic..."
                  className="rounded-xl border border-orange-500/30 bg-[var(--card-bg)] px-4 py-2.5 text-sm font-bold text-[var(--app-text)] outline-none focus:border-orange-500"
                />
                <button type="button" onClick={handleCustomTopicAdd} className="rounded-xl bg-orange-500 p-2.5 text-white">
                  <Plus size={16} />
                </button>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomTopic(true)}
                className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
              >
                <Plus size={16} /> Other
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">Primary SEO & Content Goals</label>
        <div className="flex flex-wrap gap-3">
          {seoGoalOptions.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleSelection("seoGoals", goal)}
              className={selectedSEOGoals.includes(goal) ? activeChipStyles : chipStyles}
            >
              {goal}
            </button>
          ))}

          {/* Custom Goals */}
          {selectedSEOGoals.filter(g => !seoGoalOptions.includes(g)).map(g => (
            <button key={g} type="button" onClick={() => toggleSelection("seoGoals", g)} className={activeChipStyles}>
              <span>{g}</span>
              <X size={14} className="opacity-70" />
            </button>
          ))}

          <AnimatePresence>
            {showCustomSEOGoal ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={customSEOGoal}
                  onChange={(e) => setCustomSEOGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSEOGoalAdd()}
                  placeholder="Custom goal..."
                  className="rounded-xl border border-orange-500/30 bg-[var(--card-bg)] px-4 py-2.5 text-sm font-bold text-[var(--app-text)] outline-none focus:border-orange-500"
                />
                <button type="button" onClick={handleCustomSEOGoalAdd} className="rounded-xl bg-orange-500 p-2.5 text-white">
                  <Plus size={16} />
                </button>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomSEOGoal(true)}
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
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 flex items-center gap-2 uppercase tracking-wider">
            <Users className="w-4 h-4 text-orange-500" />
            Market Competitors
          </label>
          <input
            value={data.competitor}
            onChange={(e) => updateKeywords({ competitor: e.target.value })}
            placeholder="e.g. HubSpot, Canva"
            className={inputStyles}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 flex items-center gap-2 uppercase tracking-wider">
            <Target className="w-4 h-4 text-orange-500" />
            Core Focus Areas
          </label>
          <input
            value={data.focus}
            onChange={(e) => updateKeywords({ focus: e.target.value })}
            placeholder="e.g. Scalability, ROI"
            className={inputStyles}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          Topics to Strictly Avoid
        </label>
        <textarea
          rows="3"
          value={data.avoid}
          onChange={(e) => updateKeywords({ avoid: e.target.value })}
          placeholder="e.g. Controversial politics, technical jargon..."
          className={`${inputStyles} resize-none`}
        />
      </div>
    </motion.div>
  );
}

export default Keywords;
