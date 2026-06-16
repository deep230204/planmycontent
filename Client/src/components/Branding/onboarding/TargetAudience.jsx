import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  Play,
  Briefcase,
  Music,
  Monitor,
  MapPin,
  Plus,
  Target as TargetIcon,
  ChevronDown,
} from "lucide-react";

function TargetAudience({ formData, setFormData }) {
  const audienceData = formData.audience || {};
  const data = {
    audienceType: Array.isArray(audienceData.audienceType) 
      ? audienceData.audienceType 
      : (audienceData.audienceType ? [audienceData.audienceType] : []),
    ageGroup: Array.isArray(audienceData.ageGroup) 
      ? audienceData.ageGroup 
      : (audienceData.ageGroup ? [audienceData.ageGroup] : []),
    interests: Array.isArray(audienceData.interests) ? audienceData.interests : [],
    platforms: Array.isArray(audienceData.platforms) ? audienceData.platforms : [],
    profession: audienceData.profession || "",
    painPoints: audienceData.painPoints || "",
    goals: audienceData.goals || "",
    awarenessLevel: audienceData.awarenessLevel || "",
    location: audienceData.location || "",
    customCity: audienceData.customCity || "",
    buyingPower: audienceData.buyingPower || "",
  };

  const ageOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const interestOptions = [
    "Marketing",
    "Branding",
    "Business Growth",
    "Social Media",
    "Content Creation",
    "Sales",
    "Technology",
    "Finance",
  ];

  const platformOptions = [
    { name: "Instagram", icon: Globe },
    { name: "LinkedIn", icon: Briefcase },
    { name: "YouTube", icon: Play },
    { name: "Facebook", icon: Users },
    { name: "X", icon: Monitor },
    { name: "TikTok", icon: Music },
  ];

  const [customInterest, setCustomInterest] = useState("");
  const [showCustomPlatform, setShowCustomPlatform] = useState(false);
  const [customPlatform, setCustomPlatform] = useState("");

  const updateField = (field, value) => {
    const updated = { ...data, [field]: value };
    setFormData((prev) => ({ ...prev, audience: updated }));
  };

  const handleCustomInterest = (e) => {
    if (e.key === "Enter" && customInterest.trim()) {
      e.preventDefault();
      if (!data.interests.includes(customInterest.trim())) {
        toggleValue("interests", customInterest.trim());
      }
      setCustomInterest("");
    }
  };

  const handleCustomPlatform = (e) => {
    if (e.key === "Enter" && customPlatform.trim()) {
      e.preventDefault();
      if (!data.platforms.includes(customPlatform.trim())) {
        toggleValue("platforms", customPlatform.trim());
      }
      setCustomPlatform("");
      setShowCustomPlatform(false);
    }
  };

  const toggleValue = (field, value) => {
    const updated = data[field].includes(value)
      ? data[field].filter((item) => item !== value)
      : [...data[field], value];
    const newData = { ...data, [field]: updated };
    setFormData((prev) => ({ ...prev, audience: newData }));
  };

  const inputStyles = "w-full rounded-2xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-4 text-[15px] text-[var(--app-text)] placeholder:text-[var(--muted-text)] outline-none transition-all duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:shadow-[0_0_0_4px_rgba(244,124,53,0.1)]";
  const chipStyles = "flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-bold text-[var(--muted-text)] transition-all duration-300 hover:border-orange-500/30 hover:bg-[var(--soft-bg)] active:scale-95";
  const activeChipStyles = "flex items-center gap-2 rounded-xl border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 active:scale-95";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <TargetIcon className="h-4 w-4 text-orange-500" />
            Audience Type
          </label>
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit rounded-2xl bg-[var(--soft-bg)] p-1.5 border border-[var(--app-border)]">
              {["B2B", "B2C"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleValue("audienceType", type)}
                  className={`rounded-xl px-8 py-2.5 text-sm font-black transition-all duration-300 ${
                    data.audienceType.includes(type)
                      ? "bg-[var(--card-bg)] dark:bg-slate-800 text-[var(--app-text)] shadow-sm ring-1 ring-[var(--app-border)]"
                      : "text-[var(--muted-text)] opacity-60 hover:opacity-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 ml-1">Select one or both if applicable</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-orange-500" />
            Primary Location
          </label>
          <div className="relative">
            <select
              value={data.location}
              onChange={(e) => updateField("location", e.target.value)}
              className={`${inputStyles} appearance-none cursor-pointer bg-[var(--card-bg)] pr-12`}
            >
              <option value="">Select Location</option>
              <option value="Global">Global</option>
              <option value="India">India Wide</option>
              <option value="USA">USA Wide</option>
              <option value="Specific City">Specific City</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none h-5 w-5 text-[var(--muted-text)] opacity-60" />
          </div>
          {data.location === "Specific City" ? (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              type="text"
              placeholder="Enter city name..."
              value={data.customCity}
              onChange={(e) => updateField("customCity", e.target.value)}
              className={inputStyles}
            />
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            Target Age Group
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {ageOptions.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => toggleValue("ageGroup", age)}
              className={data.ageGroup.includes(age) ? activeChipStyles : chipStyles}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
          Detailed Audience Persona
        </label>
        <textarea
          rows="3"
          placeholder="e.g. Marketing Managers at tech startups looking for ROI-driven strategies..."
          value={data.profession}
          onChange={(e) => updateField("profession", e.target.value)}
          className={`${inputStyles} resize-none`}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            Key Interests
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleValue("interests", interest)}
              className={
                data.interests.includes(interest) ? activeChipStyles : chipStyles
              }
            >
              {interest}
            </button>
          ))}
          {data.interests.filter(i => !interestOptions.includes(i)).map(interest => (
             <button
              key={interest}
              type="button"
              onClick={() => toggleValue("interests", interest)}
              className={activeChipStyles}
            >
              {interest}
            </button>
          ))}
          <div className="relative">
            <input
              type="text"
              placeholder="+ Add other"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={handleCustomInterest}
              className={`${chipStyles} w-[120px] bg-[var(--soft-bg)] border-dashed border-[var(--app-border)] hover:border-orange-500 focus:w-[180px] focus:bg-[var(--card-bg)] focus:border-orange-500 outline-none transition-all`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[var(--app-text)] opacity-70 uppercase tracking-wider">
            Primary Platforms
          </label>
          <span className="text-[10px] font-medium text-[var(--muted-text)] opacity-60 italic">Select one or more</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {platformOptions.map((platform) => {
            const Icon = platform.icon;
            const isSelected = data.platforms.includes(platform.name);

            return (
              <button
                key={platform.name}
                type="button"
                onClick={() => toggleValue("platforms", platform.name)}
                className={`flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-300 ${
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
                <span className="text-sm font-bold">{platform.name}</span>
              </button>
            );
          })}

          {data.platforms.filter(p => !platformOptions.map(o => o.name).includes(p)).map(pName => (
            <button
                key={pName}
                type="button"
                onClick={() => toggleValue("platforms", pName)}
                className="flex items-center gap-3 rounded-2xl border border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm px-5 py-4 transition-all duration-300"
              >
                <div className="rounded-xl p-2 bg-orange-500 text-white">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-bold">{pName}</span>
              </button>
          ))}

          {showCustomPlatform ? (
            <div className="flex items-center gap-3 rounded-2xl border border-orange-500 bg-[var(--card-bg)] px-5 py-4 shadow-md ring-4 ring-orange-500/5">
              <input
                autoFocus
                type="text"
                placeholder="Platform name..."
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                onKeyDown={handleCustomPlatform}
                onBlur={() => !customPlatform && setShowCustomPlatform(false)}
                className="w-full text-sm font-bold outline-none text-[var(--app-text)] bg-transparent"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomPlatform(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--app-border)] bg-[var(--soft-bg)] px-5 py-4 text-sm font-bold text-[var(--muted-text)] hover:border-orange-500/40 hover:text-orange-500 transition-all active:scale-95"
            >
              <Plus size={18} />
              Add Other
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TargetAudience;
