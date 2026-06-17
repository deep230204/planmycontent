import React, { useState, useMemo, useEffect } from "react";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import { useDashboardData } from "../hooks/useDashboardData";
import { Search, X, Lightbulb, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SavedIdeaCard from "../components/Branding/dashboard/SavedIdeaCard";

const IdeasPage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?._id || storedUser?.id;
  const { data, loading, removeIdeaOptimistically } = useDashboardData(userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredIdeas = useMemo(() => {
    return data.ideas.filter((idea) => {
      const search = debouncedSearch.toLowerCase();
      return (
        (idea.title || "").toLowerCase().includes(search) ||
        (idea.description || "").toLowerCase().includes(search)
      );
    });
  }, [data.ideas, debouncedSearch]);

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-orange-500/20 text-orange-400 font-bold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <WorkspaceShell
      title="Content Ideas"

      description="Store your raw concepts, hooks, and content topics here."
      dashboardSection="Ideas"
      badge="Thinking Layer"
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-xl border py-2 pl-10 pr-10 text-sm outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
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
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--muted-text)" }}>
          Showing <span className="font-bold" style={{ color: "var(--app-text)" }}>{filteredIdeas.length}</span> ideas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SavedIdeaCard
                idea={{
                  ...idea,
                  title: highlightText(idea.title || "", debouncedSearch),
                  description: highlightText(idea.description || "", debouncedSearch),
                }}
                onRemove={() => removeIdeaOptimistically(idea._id)}
                onExpand={() =>
                  navigate("/idea", {
                    state: {
                      selectedIdea: idea,
                      onboardingData: idea.onboardingData || data.userMeta?.onboardingData || {},
                    },
                  })
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredIdeas.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full p-6" style={{ background: "var(--soft-bg)" }}>
            <Lightbulb size={40} style={{ color: "var(--muted-text)", opacity: 0.4 }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "var(--app-text)" }}>No results found</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            {searchTerm ? "Try a different search term." : "Start saving ideas from the results page!"}
          </p>
        </div>
      )}
    </WorkspaceShell>
  );
};

export default IdeasPage;
