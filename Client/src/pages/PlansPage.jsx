import React, { useState, useMemo, useEffect } from "react";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import { useDashboardData } from "../hooks/useDashboardData";
import { Search, X, Workflow, Trash2, ArrowRight, CalendarDays, Globe, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "../utils/dashboardUtils";

const PlansPage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?._id || storedUser?.id;
  const { data, loading, removePlanOptimistically } = useDashboardData(userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPlans = useMemo(() => {
    return data.plans.filter((plan) => {
      const search = debouncedSearch.toLowerCase();
      const matchesSearch =
        (plan.title || "").toLowerCase().includes(search) ||
        (plan.onboardingData?.brandIdentity?.niche || plan.industry || "").toLowerCase().includes(search) ||
        (plan.onboardingData?.contentType?.platform || "").toLowerCase().includes(search);

      const matchesPlatform = 
        platformFilter === "All" ||
        (plan.onboardingData?.contentType?.platform || "").toLowerCase() === platformFilter.toLowerCase();

      return matchesSearch && matchesPlatform;
    });
  }, [data.plans, debouncedSearch, platformFilter]);

  const platforms = ["All", "Instagram", "LinkedIn", "YouTube", "TikTok", "Twitter"];

  return (
    <WorkspaceShell
      title="Full Content Plans"
      description="Access your full strategic content roadmaps."
      dashboardSection="Plans"
      badge="Strategy Layer"
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 rounded-xl border py-2 pl-10 pr-10 text-sm outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
            style={{ 
              background: "var(--card-bg)", 
              borderColor: "var(--app-border)", 
              color: "var(--app-text)" 
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`rounded-full px-4 py-1.5 text-xs font-black transition-all ${
              platformFilter === p
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "border hover:bg-white/5"
            }`}
            style={platformFilter !== p ? { background: "var(--card-bg)", borderColor: "var(--app-border)", color: "var(--muted-text)" } : {}}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan._id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative flex flex-col rounded-[32px] border transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl hover:-translate-y-1"
              style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--soft-bg)] text-blue-400 shadow-sm">
                  <CalendarDays size={28} />
                </div>
                <button
                  onClick={() => removePlanOptimistically(plan._id)}
                  className="rounded-xl p-2 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  style={{ color: "var(--muted-text)" }}
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black" style={{ color: "var(--app-text)" }}>{plan.title}</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--muted-text)" }}>
                    <Globe size={14} className="text-orange-500" />
                    {plan.onboardingData?.brandIdentity?.niche || plan.industry || "General"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--muted-text)" }}>
                    <User size={14} className="text-blue-400" />
                    {plan.onboardingData?.contentType?.platform || "Instagram"}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.5 }}>
                  {getTimeAgo(plan.createdAt)}
                </div>
                <button
                  onClick={() => navigate("/WeeklyPlanPage", { 
                    state: { 
                      plan: plan.plan,
                      selectedIdea: plan.selectedIdea,
                      onboardingData: plan.onboardingData
                    } 
                  })}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:bg-orange-600 shadow-orange-500/20"
                >
                  View Strategy <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPlans.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full p-6" style={{ background: "var(--soft-bg)" }}>
            <Workflow size={40} style={{ color: "var(--muted-text)", opacity: 0.4 }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "var(--app-text)" }}>No plans found</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            {searchTerm ? "Try a different search term." : "Generate your first 7-day plan to see it here!"}
          </p>
        </div>
      )}
    </WorkspaceShell>
  );
};

export default PlansPage;
