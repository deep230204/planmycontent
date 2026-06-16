import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Target, Zap, Megaphone, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";

const PlanView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.selectedIdea || location.state?.content;
  const fromDashboard = location.state?.fromDashboard;

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "var(--app-bg)" }}>
        <div className="mb-6 rounded-full p-6" style={{ background: "var(--soft-bg)", color: "var(--muted-text)" }}>
          <Zap size={48} />
        </div>
        <h2 className="text-2xl font-black" style={{ color: "var(--app-text)" }}>Strategy Not Found</h2>
        <p className="mt-2 max-w-xs" style={{ color: "var(--muted-text)" }}>We couldn't load the details for this post. Please try again from the dashboard.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    const text = `Title: ${item.title}\n\nHook: ${item.hook || item.description}\n\nAngle: ${item.angle}\n\nStrategy: ${item.painPoint || item.why || item.engagement}`;
    navigator.clipboard.writeText(text);
    toast.success("Strategy copied to clipboard!");
  };

  return (
    <WorkspaceShell
      badge={`Strategic Daily Concept`}
      section="WeeklyPlan"
      title={item.title}
      description="A high-performance daily content strategy optimized for your brand's growth and engagement goals."
      backTo={fromDashboard ? "/dashboard" : "/ResultPage"}
      backLabel={fromDashboard ? "Dashboard" : "Results"}
      actions={
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600"
        >
          Copy Content Strategy
        </motion.button>
      }
      hero={
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/30">
            <Zap size={14} />
            Day {item.day || "X"} Strategic Post
          </div>
          <div className="flex items-center gap-2 rounded-2xl border px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em]"
               style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}>
            {item.platform || "Instagram"}
          </div>
        </motion.div>
      }
      contentClassName="mx-auto max-w-5xl pb-20"
    >
      <Toaster position="top-center" richColors />

      <div className="grid grid-cols-1 gap-8">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative overflow-hidden rounded-[50px] border p-12 transition-all duration-500 hover:border-orange-500/30"
          style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
        >
          <div className="absolute right-0 top-0 p-12 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:opacity-[0.07]">
            <Megaphone size={200} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shadow-inner">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-[0.2em]" style={{ color: "var(--app-text)" }}>
                The Viral Hook
              </h3>
            </div>
            <div className="rounded-[35px] border p-10 text-2xl font-black italic leading-relaxed md:text-4xl shadow-inner"
                 style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}>
              "{item.hook || item.description}"
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group rounded-[45px] border p-10 transition-all duration-500 hover:border-blue-500/30"
            style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-[0.15em]" style={{ color: "var(--app-text)" }}>
                Creative Angle
              </h3>
            </div>
            <p className="text-xl font-semibold leading-relaxed" style={{ color: "var(--muted-text)" }}>
              {item.angle || "A unique storytelling approach tailored for maximum audience resonance."}
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group rounded-[45px] border p-10 transition-all duration-500 hover:border-emerald-500/30"
            style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-[0.15em]" style={{ color: "var(--app-text)" }}>
                Strategic Logic
              </h3>
            </div>
            <p className="text-xl font-semibold leading-relaxed" style={{ color: "var(--muted-text)" }}>
              {item.painPoint || item.why || item.engagement || "Strategically designed to boost authority and trigger community engagement."}
            </p>
          </motion.section>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-6 sm:flex-row"
        >
          <button
            onClick={handleCopy}
            className="group flex w-full items-center justify-center gap-4 rounded-[30px] bg-orange-500 py-8 text-2xl font-black text-white shadow-2xl shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-[1.02] active:scale-95 sm:flex-1"
          >
            <Copy size={28} className="transition-transform group-hover:rotate-12" /> Copy Strategy
          </button>
          <button
            onClick={() => navigate("/onboarding")}
            className="w-full rounded-[30px] border transition-all hover:scale-[1.02] sm:w-auto px-16 py-8 text-2xl font-black"
            style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
          >
            New Topic
          </button>
        </motion.div>
      </div>
    </WorkspaceShell>
  );
};

export default PlanView;
