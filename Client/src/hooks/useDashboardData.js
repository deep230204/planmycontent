import { useState, useEffect, useCallback, useRef } from "react";
import { getDashboardData, deleteIdea, deletePlan, deleteContent } from "../services/dashboardService";
import { toast } from "sonner";

/**
 * Real-time SaaS Dashboard Engine
 * Handles polling, optimistic UI, and credit tracking
 */
export const useDashboardData = (userId) => {
  const [data, setData] = useState({ 
    ideas: [], 
    contents: [],
    plans: [], 
    credits: 10,
    membership: null,
    paymentHistory: [],
    userMeta: null,
    syncedAt: null,
    stats: { totalIdeas: 0, totalPlans: 0, totalContents: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  const fetchLatest = useCallback(async (showLoading = false) => {
    if (!userId) return;
    try {
      if (showLoading) setLoading(true);
      const result = await getDashboardData(userId);
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      if (showLoading) toast.error("Could not sync dashboard data. Check your connection.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [userId]);

  // Real-time Polling (Every 5 seconds)
  useEffect(() => {
    fetchLatest(isInitialMount.current);
    isInitialMount.current = false;

    const interval = setInterval(() => {
      fetchLatest(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchLatest]);

  // Optimistic Handlers
  const removeIdeaOptimistically = async (id) => {
    const previousData = { ...data };
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.filter(i => i._id !== id),
      stats: { ...prev.stats, totalIdeas: Math.max(0, prev.stats.totalIdeas - 1) }
    }));
    toast.success("Idea removed from your library");

    try {
      const res = await deleteIdea(id);
      if (!res.success) throw new Error("Delete failed");
    } catch (err) {
      setData(previousData);
      toast.error("Could not sync deletion. Please try again.");
    }
  };

  const removeContentOptimistically = async (id) => {
    const previousData = { ...data };
    setData(prev => ({
      ...prev,
      contents: prev.contents.filter(c => c._id !== id),
      stats: { ...prev.stats, totalContents: Math.max(0, prev.stats.totalContents - 1) }
    }));
    toast.success("Content draft removed");

    try {
      const res = await deleteContent(id);
      if (!res.success) throw new Error("Delete failed");
    } catch (err) {
      setData(previousData);
      toast.error("Sync error: Content could not be removed.");
    }
  };

  const removePlanOptimistically = async (id) => {
    const previousData = { ...data };
    setData(prev => ({
      ...prev,
      plans: prev.plans.filter(p => p._id !== id),
      stats: { ...prev.stats, totalPlans: Math.max(0, prev.stats.totalPlans - 1) }
    }));
    toast.success("Plan archived successfully");

    try {
      const res = await deletePlan(id);
      if (!res.success) throw new Error("Delete failed");
    } catch (err) {
      setData(previousData);
      toast.error("Sync error: Plan could not be removed.");
    }
  };

  return { 
    data, 
    loading, 
    removeIdeaOptimistically, 
    removeContentOptimistically,
    removePlanOptimistically,
    refresh: fetchLatest 
  };
};

