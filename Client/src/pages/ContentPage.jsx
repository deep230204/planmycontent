import React, { useState, useMemo, useEffect } from "react";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import { useDashboardData } from "../hooks/useDashboardData";
import { Search, X, FileText, Trash2, ArrowRight, Tag, Clock, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "../utils/dashboardUtils";
import { saveContent } from "../services/dashboardService";
import { toast } from "sonner";

const ContentPage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?._id || storedUser?.id;
  const { data, loading, removeContentOptimistically, refresh } = useDashboardData(userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreateManualPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim()) return toast.error("Title is required");
    setIsCreating(true);
    try {
      const res = await saveContent(userId, {
        ...newPost,
        source: "manual",
        status: "saved"
      });
      if (res.success) {
        toast.success("Post created successfully!");
        setNewPost({ title: "", body: "" });
        setShowCreateForm(false);
        refresh();
      }
    } catch (err) {
      toast.error("Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredContent = useMemo(() => {
    return data.contents.filter((item) => {
      const search = debouncedSearch.toLowerCase();
      const matchesSearch =
        (item.title || "").toLowerCase().includes(search) ||
        (item.body || "").toLowerCase().includes(search);

      const matchesFilter = 
        filter === "All" ||
        (filter === "Individual Idea" && item.source === "idea") ||
        (filter === "Individual Plan" && item.source === "plan");

      return matchesSearch && matchesFilter;
    });
  }, [data.contents, debouncedSearch, filter]);

  return (
    <WorkspaceShell
      title="My Content"
      description="Access your execution layer: Post drafts, expanded ideas, and individual strategy days."
      dashboardSection="Content"
      badge="Execution Layer"
      actions={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-xl border py-2 pl-10 pr-10 text-sm outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
              style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
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
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:-translate-y-0.5"
          >
            <Plus size={16} /> Create Post
          </button>
        </div>
      }
    >
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border p-6 shadow-xl"
          style={{ background: "var(--card-bg)", borderColor: "var(--app-border)" }}
        >
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Create Manual Post</h3>
            <button onClick={() => setShowCreateForm(false)} className="text-white/20 hover:text-white/40">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleCreateManualPost} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post title..."
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500"
                style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>Content Body</label>
              <textarea
                value={newPost.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Write your post content here..."
                rows={4}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500 resize-none"
                style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold transition-colors"
                style={{ color: "var(--muted-text)", background: "var(--soft-bg)", border: "1px solid var(--app-border)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 text-xs font-black text-white shadow-lg transition-all hover:bg-orange-600 disabled:opacity-50"
              >
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Save Content"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {["All", "Individual Idea", "Individual Plan"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-black transition-all ${
              filter === f
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "border hover:bg-white/5"
            }`}
            style={filter !== f ? { background: "var(--card-bg)", borderColor: "var(--app-border)", color: "var(--muted-text)" } : {}}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto text-xs font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.5 }}>
          Showing <span style={{ color: "var(--app-text)" }}>{filteredContent.length}</span> items
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative flex flex-col rounded-[40px] border transition-all duration-500 hover:border-orange-500/40"
              style={{ 
                background: "linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.02))", 
                borderColor: "var(--app-border)",
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)"
              }}
            >
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] ${
                      item.source === 'plan' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      item.source === 'manual' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.source === 'idea' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {item.source === 'plan' ? 'From Plan' : item.source === 'idea' ? 'From Idea' : 'Manual'}
                    </span>
                    {item.dayNumber && (
                      <span className="rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em]" style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--muted-text)" }}>
                        Day {item.dayNumber}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeContentOptimistically(item._id)}
                    className="rounded-2xl p-3 text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="text-xl font-black leading-tight" style={{ color: "var(--app-text)" }}>
                  {item.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed" style={{ color: "var(--muted-text)", opacity: 0.7 }}>
                  {item.body}
                </p>

                <div className="mt-8 flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                    <Clock size={12} className="text-orange-500" />
                    {getTimeAgo(item.createdAt)}
                  </div>
                  <button
                    onClick={() => navigate("/PlanView", { state: { content: item } })}
                    className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400"
                  >
                    Open Editor 
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredContent.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full p-6" style={{ background: "var(--soft-bg)" }}>
            <FileText size={40} style={{ color: "var(--muted-text)", opacity: 0.4 }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "var(--app-text)" }}>No results found</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            {searchTerm ? "Try a different search term." : "Your execution layer is empty. Start saving content or create manual posts!"}
          </p>
        </div>
      )}
    </WorkspaceShell>
  );
};

export default ContentPage;
