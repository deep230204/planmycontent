import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Globe, 
  FileText, 
  Target, 
  Zap, 
  Sparkles,
  Rocket,
  TrendingUp,
  Award,
  Lightbulb
} from "lucide-react";
import { useState } from "react";

function BrandBasic({ formData, setFormData }) {
  const brandBasicData = formData.brandBasic || {};
  const data = {
    brandName: brandBasicData.brandName || "",
    industry: Array.isArray(brandBasicData.industry) 
      ? brandBasicData.industry 
      : (brandBasicData.industry ? [brandBasicData.industry] : []),
    description: brandBasicData.description || "",
    usp: brandBasicData.usp || "",
    brandStage: Array.isArray(brandBasicData.brandStage) 
      ? brandBasicData.brandStage 
      : (brandBasicData.brandStage ? [brandBasicData.brandStage] : []),
  };

  const industries = ["Fitness", "SaaS", "Finance", "E-commerce", "Creator"];
  const stages = [
    { label: "Idea stage", icon: Lightbulb },
    { label: "Early growth", icon: TrendingUp },
    { label: "Scaling", icon: Rocket },
    { label: "Established", icon: Award }
  ];

  const updateData = (updatedFields) => {
    setFormData((prev) => ({
      ...prev,
      brandBasic: { ...data, ...updatedFields },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value.replace(/^\s+/, "") });
  };

  const selectIndustry = (val) => {
    const updated = data.industry.includes(val)
      ? data.industry.filter((i) => i !== val)
      : [...data.industry, val];
    updateData({ industry: updated });
  };

  const selectStage = (val) => {
    const updated = data.brandStage.includes(val)
      ? data.brandStage.filter((s) => s !== val)
      : [...data.brandStage, val];
    updateData({ brandStage: updated });
  };

  const inputStyles = "w-full rounded-2xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-4 text-[15px] font-medium text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none transition-all duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 shadow-sm";
  const labelStyles = "flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider";
  const helperStyles = "mt-1.5 text-[11px] font-medium text-[var(--muted-text)] opacity-80";
  const chipStyles = "flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--muted-text)] transition-all hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95 shadow-sm";
  const activeChipStyles = "flex items-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 active:scale-95";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]"
    >
      {/* LEFT: FORM SECTION */}
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[var(--app-text)]">Let's build your content strategy 🚀</h2>
          <p className="mt-2 text-sm text-[var(--muted-text)]">Provide a few basic details to help our AI understand your unique brand identity.</p>
        </div>

        <div className="space-y-8">
          {/* 1. Brand Name */}
          <div className="space-y-3">
            <label className={labelStyles}>
              <Building2 className="h-4 w-4 text-orange-500" />
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleChange}
              placeholder="e.g. FitWithDeep"
              className={inputStyles}
            />
            <p className={helperStyles}>This helps personalize your content identity</p>
          </div>

          {/* 2. Industry */}
          <div className="space-y-4">
            <label className={labelStyles}>
              <Globe className="h-4 w-4 text-orange-500" />
              Industry
            </label>
            <div className="flex flex-wrap gap-2.5">
              {industries.map((item) => (
                <button
                  key={item}
                  onClick={() => selectIndustry(item)}
                  className={data.industry.includes(item) ? activeChipStyles : chipStyles}
                >
                  {item}
                </button>
              ))}
              <select 
                value={data.industry.find(i => !industries.includes(i)) || ""}
                onChange={(e) => selectIndustry(e.target.value)}
                className={`${chipStyles} min-w-[120px] cursor-pointer outline-none bg-[var(--card-bg)]`}
              >
                <option value="">Other...</option>
                <option value="Education">Education</option>
                <option value="Fashion">Fashion</option>
                <option value="Marketing">Marketing</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
            <p className={helperStyles}>We tailor your strategy based on your industry benchmarks</p>
          </div>

          {/* 3. Description */}
          <div className="space-y-3">
            <label className={labelStyles}>
              <FileText className="h-4 w-4 text-orange-500" />
              What do you offer?
            </label>
            <textarea
              name="description"
              rows="3"
              value={data.description}
              onChange={handleChange}
              placeholder="Describe your product or service in simple terms..."
              className={`${inputStyles} resize-none`}
            />
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[var(--soft-bg)] p-3 border border-[var(--app-border)]">
               <span className="text-lg">💡</span>
               <p className="text-xs italic text-[var(--muted-text)] leading-relaxed">
                 <span className="font-bold text-[var(--app-text)]">Example:</span> "We help small businesses grow using AI-powered content strategies"
               </p>
            </div>
          </div>

          {/* 4. USP */}
          <div className="space-y-3">
            <label className={labelStyles}>
              <Target className="h-4 w-4 text-orange-500" />
              What makes you different? (USP)
            </label>
            <textarea
              name="usp"
              rows="3"
              value={data.usp}
              onChange={handleChange}
              placeholder="e.g. Affordable fitness coaching for beginners..."
              className={`${inputStyles} resize-none`}
            />
            <p className={helperStyles}>Your Unique Selling Point defines your content's competitive edge</p>
          </div>

          {/* 5. Brand Stage */}
          <div className="space-y-4">
            <label className={labelStyles}>
              <Zap className="h-4 w-4 text-orange-500" />
              Brand Stage
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isActive = data.brandStage.includes(stage.label);
                return (
                  <button
                    key={stage.label}
                    onClick={() => selectStage(stage.label)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300 ${
                      isActive 
                        ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-md" 
                        : "border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] hover:border-orange-500/30 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-orange-500" : "text-[var(--muted-text)] opacity-40"} />
                    <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight">
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className={helperStyles}>This helps adjust content strategy depth and complexity</p>
          </div>
        </div>
      </div>

      {/* RIGHT: LIVE PREVIEW PANEL */}
      <div className="relative">
        <div className="sticky top-10 space-y-6">
          <div className="rounded-[32px] border border-[var(--app-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-premium)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/5 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />
            
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                  <Sparkles size={18} fill="currentColor" />
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-500 border border-emerald-500/20">
                  AI Active
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] opacity-60">Brand Identity</p>
                  <h3 className="text-xl font-black text-[var(--app-text)] leading-tight">
                    {data.brandName || "Your Brand Name"}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[var(--soft-bg)] border border-[var(--app-border)] px-2.5 py-1 text-[10px] font-bold text-[var(--muted-text)]">
                    {data.industry.length > 0 ? data.industry.join(", ") : "Industry"}
                  </span>
                  <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[10px] font-bold text-orange-500">
                    {data.brandStage.length > 0 ? data.brandStage.join(", ") : "Brand Stage"}
                  </span>
                </div>

                <div className="pt-4 border-t border-[var(--app-border)]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] opacity-60 mb-2">Strategic Insight</p>
                  <div className="rounded-2xl bg-[var(--soft-bg)] p-4 border border-[var(--app-border)]">
                    <p className="text-xs font-medium text-[var(--muted-text)] leading-relaxed italic">
                      {data.brandName && data.industry.length > 0 
                        ? `AI is tailoring a high-end ${data.industry.join(" & ")} strategy for ${data.brandName}. We're analyzing your USP to build unique content hooks...`
                        : "Start typing to see how AI shapes your strategic direction in real-time..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-orange-500/5 p-4 border border-orange-500/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
                  <Target size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">Next Focus</p>
                  <p className="text-[11px] font-bold text-[var(--app-text)]">Target Audience Profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--soft-bg)] p-5 border border-[var(--app-border)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] opacity-60 mb-3">Onboarding Tip</p>
            <p className="text-xs font-medium text-[var(--muted-text)] leading-relaxed">
              Companies with a clearly defined <span className="text-orange-500 font-bold">USP</span> see a 40% higher conversion rate on social media content.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BrandBasic;
