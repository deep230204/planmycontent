import {
  MessageCircle,
  BookOpen,
  ArrowRight,
  Mic2,
  Heart,
  Award,
  Sparkles,
  Plus,
  X,
  Target,
  Feather,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function BrandVoice({ formData, setFormData }) {
  // Extracting data safely
  const voiceData = formData.voice || {};
  const data = {
    tone: Array.isArray(voiceData.tone) ? voiceData.tone : (voiceData.tone ? [voiceData.tone] : []),
    writingStyle: Array.isArray(voiceData.writingStyle) ? voiceData.writingStyle[0] || "" : voiceData.writingStyle || "",
    personality: Array.isArray(voiceData.personality) ? voiceData.personality : (voiceData.personality ? [voiceData.personality] : []),
    customTone: voiceData.customTone || "",
    customPersonality: voiceData.customPersonality || "",
    exampleBrands: voiceData.exampleBrands || "",
    wordsToAvoid: voiceData.wordsToAvoid || "",
  };

  const industry = formData.brandBasic?.industry || "";

  // State for custom inputs
  const [isAddingTone, setIsAddingTone] = useState(false);
  const [toneInput, setToneInput] = useState("");

  const [isAddingPersonality, setIsAddingPersonality] = useState(false);
  const [personalityInput, setPersonalityInput] = useState("");

  const toneOptions = [
    "Strategic",
    "Warm",
    "Bold",
    "Confident",
    "Playful",
    "Trustworthy",
    "Insightful",
  ];

  const personalityOptions = [
    "Casual",
    "Friendly",
    "Premium",
    "Luxury",
    "Minimal",
    "Professional",
    "Corporate",
    "Neutral",
  ];

  const writingStyles = [
    { title: "Conversational", icon: MessageCircle },
    { title: "Educational", icon: BookOpen },
    { title: "Direct", icon: ArrowRight },
    { title: "Storytelling", icon: Feather },
    { title: "Problem-Solving", icon: Target },
    { title: "Authority", icon: ShieldCheck },
  ];

  const updateVoice = (updatedFields) => {
    const updated = { ...data, ...updatedFields };
    setFormData((prev) => ({ ...prev, voice: updated }));
  };

  const handleToneSelect = (tone) => {
    let updated = [...data.tone];
    if (updated.includes(tone)) {
      updated = updated.filter((t) => t !== tone);
    } else {
      updated.push(tone);
    }
    updateVoice({ tone: updated });
  };

  const handleCustomToneSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      const trimmed = toneInput.trim();
      if (trimmed) {
        if (!data.tone.includes(trimmed)) {
          updateVoice({ tone: [...data.tone, trimmed] });
        }
        setToneInput("");
        setIsAddingTone(false);
      }
    }
  };

  const togglePersonality = (value) => {
    let updated = [...data.personality];
    if (updated.includes(value)) {
      updated = updated.filter((item) => item !== value);
    } else {
      updated.push(value);
    }
    updateVoice({ personality: updated });
  };

  const handleCustomPersonalitySubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      const trimmed = personalityInput.trim();
      if (trimmed) {
        if (!data.personality.includes(trimmed)) {
          updateVoice({ personality: [...data.personality, trimmed] });
        }
        setPersonalityInput("");
        setIsAddingPersonality(false);
      }
    }
  };

  const handleInput = (field) => (e) => {
    updateVoice({ [field]: e.target.value });
  };

  // Recommendations Logic based on industry
  const isRecommendedTone = (tone) => {
    if (industry.includes("Health") || industry.includes("Fitness")) {
      return ["Bold", "Confident"].includes(tone);
    }
    if (
      ["Finance", "Technology", "Coaching & Consulting"].includes(industry)
    ) {
      return ["Strategic", "Trustworthy"].includes(tone);
    }
    return false;
  };

  const isRecommendedPersonality = (val) => {
    if (
      ["Finance", "Technology", "Coaching & Consulting"].includes(industry)
    ) {
      return ["Professional", "Corporate"].includes(val);
    }
    return false;
  };

  // Preview System Generator
  const getPreviewText = () => {
    const tArray = data.tone;
    const s = data.writingStyle;
    const pArray = data.personality;
    const pStr = pArray.join(", ");

    if (tArray.length === 0 && !s && pArray.length === 0) {
      return "Select your voice options above to see a preview of how your content will sound.";
    }

    const toneText = tArray.length > 0 ? `a ${tArray.join(" and ").toLowerCase()} tone` : "a clear tone";
    const styleText = s ? `a ${s.toLowerCase()} style` : "an engaging style";
    const personalityFallback = pArray.length > 0 ? pStr.toLowerCase() : "professional";
    
    return `We will write in ${toneText}, using ${styleText}, projecting a ${personalityFallback} personality.`;
  };

  // Styles
  const chipStyles =
    "relative flex items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] transition-all duration-300 hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95";
  const activeChipStyles =
    "relative flex items-center justify-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 active:scale-95";
  const inputStyles =
    "w-full rounded-2xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-4 text-[15px] text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none transition-all duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(244,124,53,0.1)]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      {/* SECTION 1: PRIMARY TONE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70">
            <Mic2 className="h-4 w-4 text-orange-500" />
            Primary Tone <span className="text-orange-500/70">(Required)</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {toneOptions.map((tone) => {
            const isSelected = data.tone.includes(tone);
            return (
              <button
                key={tone}
                type="button"
                onClick={() => handleToneSelect(tone)}
                className={isSelected ? activeChipStyles : chipStyles}
              >
                {tone}
                {isRecommendedTone(tone) && (
                  <span className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 shadow-sm border border-amber-500/20 backdrop-blur-sm">
                    <Sparkles size={10} /> Rec
                  </span>
                )}
              </button>
            );
          })}

          {/* Custom Tones added as chips */}
          {data.tone.filter(t => !toneOptions.includes(t)).map(t => (
             <button
                key={t}
                type="button"
                onClick={() => handleToneSelect(t)}
                className={activeChipStyles}
              >
                {t}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToneSelect(t);
                  }}
                  className="ml-1 rounded-full bg-white/20 p-0.5 hover:bg-white/40"
                >
                  <X size={14} />
                </div>
              </button>
          ))}

          {isAddingTone ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="flex items-center gap-2 rounded-2xl border border-orange-500 bg-[var(--card-bg)] px-4 py-2.5 shadow-md ring-4 ring-orange-500/5"
            >
              <input
                autoFocus
                type="text"
                placeholder="Enter tone..."
                value={toneInput}
                onChange={(e) => setToneInput(e.target.value)}
                onKeyDown={handleCustomToneSubmit}
                onBlur={handleCustomToneSubmit}
                className="w-24 text-sm font-bold outline-none text-[var(--app-text)] bg-transparent"
              />
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTone(true)}
              className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--app-border)] bg-[var(--soft-bg)] px-5 py-2.5 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/40 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} />
              Other
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2: WRITING STYLE */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70">
            <BookOpen className="h-4 w-4 text-orange-500" />
            Writing Style <span className="text-orange-500/70">(Required)</span>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {writingStyles.map((style) => {
            const Icon = style.icon;
            const isSelected = data.writingStyle === style.title;
            return (
              <button
                key={style.title}
                type="button"
                onClick={() => updateVoice({ writingStyle: style.title })}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm"
                    : "border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] hover:border-orange-500/30 hover:text-[var(--app-text)]"
                }`}
              >
                <div
                  className={`rounded-xl p-2 transition-colors duration-300 ${
                    isSelected ? "bg-orange-500 text-white" : "bg-[var(--soft-bg)]"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-sm font-bold">{style.title}</span>
                {isSelected && (
                  <CheckCircle2 className="absolute top-2 right-2 text-orange-500" size={18} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: BRAND PERSONALITY */}
      <div className="space-y-6">
        <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70">
          <Heart className="h-4 w-4 text-orange-500" />
          Brand Personality <span className="text-[var(--muted-text)] font-normal opacity-60">(Optional)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {personalityOptions.map((p) => {
            const isSelected = data.personality.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePersonality(p)}
                className={isSelected ? activeChipStyles : chipStyles}
              >
                {p}
              </button>
            );
          })}

          {/* Custom Personalities added as chips */}
          {data.personality.filter(p => !personalityOptions.includes(p)).map(p => (
             <button
                key={p}
                type="button"
                onClick={() => togglePersonality(p)}
                className={activeChipStyles}
              >
                {p}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePersonality(p);
                  }}
                  className="ml-1 rounded-full bg-white/20 p-0.5 hover:bg-white/40"
                >
                  <X size={14} />
                </div>
              </button>
          ))}

          {isAddingPersonality ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="flex items-center gap-2 rounded-2xl border border-orange-500 bg-[var(--card-bg)] px-4 py-2.5 shadow-md ring-4 ring-orange-500/5"
            >
              <input
                autoFocus
                type="text"
                placeholder="Enter personality..."
                value={personalityInput}
                onChange={(e) => setPersonalityInput(e.target.value)}
                onKeyDown={handleCustomPersonalitySubmit}
                onBlur={handleCustomPersonalitySubmit}
                className="w-32 text-sm font-bold outline-none text-[var(--app-text)] bg-transparent"
              />
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingPersonality(true)}
              className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--app-border)] bg-[var(--soft-bg)] px-5 py-2.5 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/40 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} />
              Other
            </button>
          )}
        </div>
      </div>

      {/* SECTION 4: LIVE PREVIEW SYSTEM */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-[var(--soft-bg)] to-[var(--card-bg)] p-6 border border-orange-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <MessageCircle size={80} />
        </div>
        <div className="relative z-10 space-y-3">
          <label className="flex items-center gap-2 text-[13px] font-bold text-orange-500">
            <Sparkles className="h-4 w-4" />
            AI Voice Preview
          </label>
          <p className="text-lg font-medium text-[var(--app-text)] leading-relaxed italic opacity-90">
            "{getPreviewText()}"
          </p>
        </div>
      </div>

      {/* INSPIRATION & WORDS TO AVOID */}
      <div className="grid gap-8 md:grid-cols-2 pt-4 border-t border-[var(--app-border)]">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70">
            <Award className="h-4 w-4 text-orange-500" />
            Inspiration Brands
          </label>
          <input
            type="text"
            value={data.exampleBrands}
            onChange={handleInput("exampleBrands")}
            placeholder="e.g. Apple, Nike, Notion"
            className={inputStyles}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70">
            Tones to Avoid
          </label>
          <input
            type="text"
            value={data.wordsToAvoid}
            onChange={handleInput("wordsToAvoid")}
            placeholder="e.g. Cheap, Best, Guaranteed"
            className={inputStyles}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default BrandVoice;
