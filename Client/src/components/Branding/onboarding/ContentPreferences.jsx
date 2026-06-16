import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Briefcase,
  Play,
  Mail,
  FileText,
  Video,
  Image,
  PenSquare,
  Calendar,
  Layers,
  MousePointer2,
  Plus,
  Globe,
  X,
  ChevronDown,
} from "lucide-react";

function ContentPreferences({ formData, setFormData }) {
  const data = {
    platforms: [],
    contentTypes: [],
    postingFrequency: "",
    tone: [],
    cta: [],
    customPostingFrequency: "",
    ...(formData.content || {}),
  };

  const selectedPlatforms = data.platforms;
  const selectedContentTypes = data.contentTypes;
  const postingFrequency = data.postingFrequency;
  const selectedTone = data.tone;
  const selectedCTA = data.cta;

  const [customInputs, setCustomInputs] = useState({
    platform: "",
    contentType: "",
    tone: "",
    cta: "",
  });

  const [activeInputs, setActiveInputs] = useState({
    platform: false,
    contentType: false,
    tone: false,
    cta: false,
  });

  const updateContent = (updatedFields) => {
    const updated = { ...data, ...updatedFields };
    setFormData((prev) => ({ ...prev, content: updated }));
  };

  const toggleSelection = (field, value) => {
    const currentValues = Array.isArray(data[field]) ? data[field] : [];
    const updated = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    updateContent({ [field]: updated });
  };

  const handleCustomAdd = (field, stateKey) => {
    const value = customInputs[stateKey].trim();
    if (value) {
      if (!data[field].includes(value)) {
        toggleSelection(field, value);
      }
      setCustomInputs((prev) => ({ ...prev, [stateKey]: "" }));
      setActiveInputs((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  const platforms = [
    { name: "Instagram", icon: Camera },
    { name: "LinkedIn", icon: Briefcase },
    { name: "YouTube", icon: Play },
    { name: "Newsletter", icon: Mail },
  ];

  const contentTypes = [
    { name: "Carousel", icon: Image },
    { name: "Short-form Video", icon: Video },
    { name: "Blog Post", icon: FileText },
    { name: "Story Post", icon: PenSquare },
    { name: "Email", icon: Mail },
    { name: "Case Study", icon: FileText },
  ];

  const toneOptions = [
    "Educational",
    "Inspirational",
    "Promotional",
    "Storytelling",
    "Trend-Based",
  ];
  const ctaOptions = ["Learn More", "Book a Call", "Sign Up", "Buy Now"];

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
      className="space-y-12"
    >
      {/* SECTION 1: PLATFORMS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <Layers className="h-4 w-4 text-orange-500" />
            Primary Channels
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.name);
            return (
              <button
                key={platform.name}
                type="button"
                onClick={() => toggleSelection("platforms", platform.name)}
                className={isSelected ? activeChipStyles : chipStyles}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} /> {platform.name}
                </div>
              </button>
            );
          })}

          {/* Custom Platforms */}
          {selectedPlatforms.filter(p => !platforms.map(o => o.name).includes(p)).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => toggleSelection("platforms", p)}
              className={activeChipStyles}
            >
              <div className="flex items-center gap-2">
                <Globe size={16} /> {p} <X size={14} className="ml-1 opacity-70" />
              </div>
            </button>
          ))}

          {activeInputs.platform ? (
            <input
              autoFocus
              type="text"
              placeholder="Enter platform..."
              value={customInputs.platform}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, platform: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCustomAdd("platforms", "platform")}
              onBlur={() => handleCustomAdd("platforms", "platform")}
              className={`${chipStyles} w-32 outline-none border-orange-500`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActiveInputs(prev => ({ ...prev, platform: true }))}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/50 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} /> Other
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2: FORMATS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <FileText className="h-4 w-4 text-orange-500" />
            Preferred Formats
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedContentTypes.includes(type.name);
            return (
              <button
                key={type.name}
                type="button"
                onClick={() => toggleSelection("contentTypes", type.name)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm"
                    : "border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] hover:border-orange-500/30 hover:text-[var(--app-text)]"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-orange-500" : "text-[var(--muted-text)] opacity-40"} />
                <span className="text-xs font-bold">{type.name}</span>
              </button>
            );
          })}

          {/* Custom Formats */}
          {selectedContentTypes.filter(p => !contentTypes.map(o => o.name).includes(p)).map(p => (
             <button
                key={p}
                type="button"
                onClick={() => toggleSelection("contentTypes", p)}
                className="flex items-center gap-3 rounded-2xl border border-orange-500 bg-orange-500/10 text-orange-500 px-4 py-3"
              >
                <Layers size={16} />
                <span className="text-xs font-bold">{p}</span>
                <X size={14} className="ml-auto opacity-70" />
              </button>
          ))}

          {activeInputs.contentType ? (
            <div className="flex items-center gap-3 rounded-2xl border border-orange-500 bg-[var(--card-bg)] px-4 py-3 ring-4 ring-orange-500/5">
               <input
                autoFocus
                type="text"
                placeholder="Format name..."
                value={customInputs.contentType}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, contentType: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleCustomAdd("contentTypes", "contentType")}
                onBlur={() => handleCustomAdd("contentTypes", "contentType")}
                className="w-full text-xs font-bold outline-none text-[var(--app-text)] bg-transparent"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveInputs(prev => ({ ...prev, contentType: true }))}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--app-border)] bg-[var(--soft-bg)] px-4 py-3 text-xs font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/40 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} /> Add Other
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: CADENCE */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
          <Calendar className="h-4 w-4 text-orange-500" />
          Posting Cadence
        </label>
        <div className="space-y-3">
          <div className="relative">
            <select
              value={postingFrequency}
              onChange={(e) => updateContent({ postingFrequency: e.target.value })}
              className={`${inputStyles} appearance-none cursor-pointer bg-[var(--card-bg)] pr-12`}
            >
              <option value="">Select Posting Cadence</option>
              <option>Daily</option>
              <option>3 Times / Week</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option value="Other">Other...</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none h-5 w-5 text-[var(--muted-text)] opacity-60" />
          </div>
          
          <AnimatePresence>
            {postingFrequency === "Other" && (
              <motion.input
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                type="text"
                placeholder="e.g. Twice a Month, 5 Times / Week..."
                value={data.customPostingFrequency}
                onChange={(e) => updateContent({ customPostingFrequency: e.target.value })}
                className={inputStyles}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 4: TONE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            Content Angle / Tone
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {toneOptions.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => toggleSelection("tone", tone)}
              className={selectedTone.includes(tone) ? activeChipStyles : chipStyles}
            >
              {tone}
            </button>
          ))}

          {selectedTone.filter(t => !toneOptions.includes(t)).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleSelection("tone", t)}
              className={activeChipStyles}
            >
              {t} <X size={14} className="ml-1 opacity-70" />
            </button>
          ))}

          {activeInputs.tone ? (
             <input
              autoFocus
              type="text"
              placeholder="Enter tone..."
              value={customInputs.tone}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, tone: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCustomAdd("tone", "tone")}
              onBlur={() => handleCustomAdd("tone", "tone")}
              className={`${chipStyles} w-32 outline-none border-orange-500`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActiveInputs(prev => ({ ...prev, tone: true }))}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/50 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} /> Other
            </button>
          )}
        </div>
      </div>

      {/* SECTION 5: CTA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <MousePointer2 className="h-4 w-4 text-orange-500" />
            Preferred Call to Action
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {ctaOptions.map((cta) => (
            <button
              key={cta}
              type="button"
              onClick={() => toggleSelection("cta", cta)}
              className={selectedCTA.includes(cta) ? activeChipStyles : chipStyles}
            >
              {cta}
            </button>
          ))}

          {selectedCTA.filter(t => !ctaOptions.includes(t)).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleSelection("cta", t)}
              className={activeChipStyles}
            >
              <span>{t}</span>
              <X size={14} className="opacity-70" />
            </button>
          ))}

          {activeInputs.cta ? (
             <input
              autoFocus
              type="text"
              placeholder="Enter CTA..."
              value={customInputs.cta}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, cta: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCustomAdd("cta", "cta")}
              onBlur={() => handleCustomAdd("cta", "cta")}
              className={`${chipStyles} w-32 outline-none border-orange-500`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActiveInputs(prev => ({ ...prev, cta: true }))}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] opacity-60 hover:border-orange-500/50 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={16} /> Other
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ContentPreferences;
