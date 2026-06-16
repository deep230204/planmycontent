import React, { useEffect, useMemo, useState } from "react";
import logo1 from "../assets/logo1.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Bookmark,
  CalendarDays,
  History,
  Settings,
  Plus,
  Search,
  ArrowRight,
  Zap,
  Target,
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  User,
  LogOut,
  Trash2,
  Camera,
  PlayCircle,
  Briefcase,
  Rocket,
  Brain,
  Award,
  Eye,
  Compass,
  Crown,
  CreditCard,
  Wallet,
  ShieldCheck,
  Gem,
  Star,
  FileText,
  Workflow,
  Lightbulb,
} from "lucide-react";

import { toast } from "sonner";
import { useDashboardData } from "../hooks/useDashboardData";
import { getTimeAgo } from "../utils/dashboardUtils";
import SavedIdeaCard from "../components/Branding/dashboard/SavedIdeaCard";
import PricingCard from "../components/Branding/dashboard/PricingCard";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import { useTheme } from "../context/ThemeContext";



const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("User");
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const { isDark } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );
  const userId = storedUser?._id || storedUser?.id;

  const {
    data: dashboardData,
    loading,
    removeIdeaOptimistically,
    removePlanOptimistically,
  } = useDashboardData(userId);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    setUserData(user);
    setUserName(user.name || user.username || "Creator");
  }, [navigate]);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (!dashboardData.userMeta) return;

    if (dashboardData.userMeta.name) {
      setUserName(dashboardData.userMeta.name);
    }

    setUserData((prev) => {
      const updated = {
        ...(prev || {}),
        name: dashboardData.userMeta.name || prev?.name,
        email: dashboardData.userMeta.email || prev?.email,
        membership: dashboardData.membership || prev?.membership,
        onboardingData: dashboardData.userMeta.onboardingData || prev?.onboardingData,
      };
      
      // Sync to localStorage
      localStorage.setItem("user", JSON.stringify(updated));
      if (dashboardData.userMeta.onboardingData) {
        localStorage.setItem("latestOnboardingData", JSON.stringify(dashboardData.userMeta.onboardingData));
      }
      return updated;
    });
  }, [dashboardData.membership, dashboardData.userMeta]);

  const navItems = [
    { id: "Overview", label: "Overview", icon: LayoutDashboard },
  ];


  const membershipPlans = [
    {
      planId: "starter",
      name: "Starter",
      price: "Free",
      subtitle: "Try the workspace and generate core strategy assets.",
      accent: "from-slate-100 to-white",
      border: "border-slate-200",
      monthlyCredits: 10,
      features: ["10 monthly AI credits", "Idea library", "Single workspace"],
      buttonLabel: "Included by Default",
    },
    {
      planId: "pro",
      name: "Pro Creator",
      price: "Rs 799/mo",
      subtitle: "Best for solo creators who need a premium weekly engine.",
      accent: "from-orange-500 to-amber-400",
      border: "border-orange-200",
      monthlyCredits: 250,
      features: [
        "250 monthly AI credits",
        "Priority weekly plans",
        "Premium exports and deeper history",
      ],
      featured: true,
      buttonLabel: "Pay with Razorpay",
    },
    {
      planId: "studio",
      name: "Studio",
      price: "Rs 1,999/mo",
      subtitle: "Built for teams and multi-brand planning at scale.",
      accent: "from-[#07122b] to-[#20375f]",
      border: "border-slate-200",
      monthlyCredits: 1000,
      features: [
        "1000 monthly AI credits",
        "Advanced planning scale",
        "Multi-brand membership positioning",
      ],
      buttonLabel: "Pay with Razorpay",
    },
  ];

  const paymentMethods = [
    {
      title: "Credit / Debit Card",
      detail: "Visa, Mastercard, RuPay",
      Icon: CreditCard,
      tone: "rgba(59,130,246,0.1)",
      textColor: "text-blue-400",
    },
    {
      title: "UPI",
      detail: "Google Pay, PhonePe, Paytm",
      Icon: Wallet,
      tone: "rgba(16,185,129,0.1)",
      textColor: "text-emerald-400",
    },
    {
      title: "Secure Billing",
      detail: "Server-side signature verification before activation",
      Icon: ShieldCheck,
      tone: "rgba(249,115,22,0.1)",
      textColor: "text-orange-400",
    },
  ];

  const handleRemoveIdea = async (ideaId) => {
    await removeIdeaOptimistically(ideaId);
  };

  const handleRemovePlan = async (planId) => {
    await removePlanOptimistically(planId);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNewStrategy = () => {
    navigate("/onboarding", { state: { freshStart: true } });
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpgradePlan = async (plan) => {
    if (plan.planId === "starter") {
      toast.message("Starter is already available by default.");
      return;
    }

    if (!userData?.email) {
      toast.error("Please login again.");
      return;
    }

    setProcessingPlanId(plan.planId);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const orderRes = await fetch(
        "https://planmycontent.onrender.com/api/auth/payments/razorpay/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            planId: plan.planId,
          }),
        }
      );

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order.");
      }

      const razorpay = new window.Razorpay({
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        name: "PlanMyContent",
        description: `${orderData.plan.name} Membership`,
        prefill: {
          name: userData.name || userName,
          email: userData.email,
        },
        theme: {
          color: "#f47c35",
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              "https://planmycontent.onrender.com/api/auth/payments/razorpay/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: userData.email,
                  planId: plan.planId,
                  ...response,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            const previousUser =
              JSON.parse(localStorage.getItem("user") || "null") || {};
            const updatedUser = { ...previousUser, ...verifyData.user };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserData(updatedUser);
            toast.success(`${plan.name} activated successfully.`);
          } catch (error) {
            toast.error(error.message || "Unable to verify payment.");
          } finally {
            setProcessingPlanId(null);
          }
        },
        modal: {
          ondismiss: () => setProcessingPlanId(null),
        },
      });

      razorpay.open();
    } catch (error) {
      const message = error.message || "Unable to start checkout.";
      const isConfigIssue =
        message.includes("RAZORPAY_KEY_ID") ||
        message.includes("RAZORPAY_KEY_SECRET") ||
        message.toLowerCase().includes("razorpay is not configured");

      toast.error(
        isConfigIssue
          ? "Razorpay is not set up yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Server/.env, then restart the backend."
          : message
      );
      setProcessingPlanId(null);
    }
  };

  const getActivityIcon = (item, index) => {
    if (item.plan) {
      return { Icon: CalendarDays, color: "text-blue-400", bg: "rgba(59,130,246,0.1)" };
    }

    const platform = (item.platform || "").toLowerCase();
    if (platform.includes("instagram")) {
      return { Icon: Camera, color: "text-pink-400", bg: "rgba(236,72,153,0.1)" };
    }
    if (platform.includes("youtube")) {
      return { Icon: PlayCircle, color: "text-red-400", bg: "rgba(239,68,68,0.1)" };
    }
    if (platform.includes("linkedin")) {
      return { Icon: Briefcase, color: "text-blue-400", bg: "rgba(37,99,235,0.1)" };
    }

    const pool = [Rocket, Brain, Target, Award, Eye, Compass, Zap];
    const colors = [
      "text-orange-400",
      "text-purple-400",
      "text-cyan-400",
      "text-emerald-400",
      "text-indigo-400",
      "text-rose-400",
      "text-amber-400",
    ];
    const bgs = [
      "rgba(249,115,22,0.1)",
      "rgba(168,85,247,0.1)",
      "rgba(6,182,212,0.1)",
      "rgba(16,185,129,0.1)",
      "rgba(99,102,241,0.1)",
      "rgba(244,63,94,0.1)",
      "rgba(245,158,11,0.1)",
    ];

    const idx = index % pool.length;
    return { Icon: pool[idx], color: colors[idx], bg: bgs[idx] };
  };

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse rounded-2xl bg-[var(--app-border)] opacity-20 ${className}`} />
  );

  const recentItems = [...dashboardData.ideas, ...dashboardData.plans]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const allPlans = [
    ...dashboardData.plans.map((plan) => ({ ...plan, isFullPlan: true })),
    ...dashboardData.ideas
      .filter((idea) => idea.isDailyPlan)
      .map((idea) => ({ ...idea, isFullPlan: false })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const currentMembership = dashboardData.membership || userData?.membership || {
    planId: "starter",
    planName: "Starter",
    status: "inactive",
    paymentMethod: "",
    startedAt: null,
    lastPaymentAt: null,
  };

  const currentPlanConfig =
    membershipPlans.find((plan) => plan.planId === currentMembership?.planId) ||
    membershipPlans[0];
  const creditLimit = currentPlanConfig?.monthlyCredits || 10;
  const remainingCredits = dashboardData.credits || 0;
  const consumedCredits = Math.max(creditLimit - remainingCredits, 0);
  const creditsUsedPercent = Math.min((remainingCredits / creditLimit) * 100, 100);
  const membershipIsActive =
    currentMembership?.planId !== "starter" && currentMembership?.status === "active";
  const lastPayment = [...(dashboardData.paymentHistory || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const syncedAt = dashboardData.syncedAt ? new Date(dashboardData.syncedAt) : null;

  const formatShortDate = (value) => {
    if (!value) return "Not available yet";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  };

  const getSyncLabel = () => {
    if (!syncedAt) return "Waiting for first sync";
    const seconds = Math.max(
      0,
      Math.round((Date.now() - syncedAt.getTime()) / 1000)
    );
    if (seconds < 10) return "Synced just now";
    if (seconds < 60) return `Synced ${seconds}s ago`;
    return `Synced ${Math.floor(seconds / 60)}m ago`;
  };

  const liveHighlights = [
    {
      title: "Live workspace",
      detail: `${dashboardData.stats.totalIdeas} ideas and ${dashboardData.stats.totalPlans} plans are available in your dashboard right now.`,
    },
    {
      title: "Membership state",
      detail: membershipIsActive
        ? `${currentMembership.planName} is active with ${currentMembership.paymentMethod || "Razorpay"} billing.`
        : "Starter workspace is active and ready for your next upgrade.",
    },
    {
      title: "Real-time sync",
      detail: `${getSyncLabel()} with 5-second dashboard refresh polling.`,
    },
  ];

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      <section className={`relative overflow-hidden rounded-[42px] p-8 shadow-[0_35px_90px_rgba(7,18,43,0.22)] lg:p-10 transition-colors duration-500 ${
        isDark ? "bg-gradient-to-br from-[#07122b] via-[#12274a] to-[#20375f] text-white" : "bg-white border border-slate-100 text-[#07122b]"
      }`}>

        <div className={`absolute -right-14 -top-14 h-56 w-56 rounded-full blur-2xl ${isDark ? "bg-white/5" : "bg-blue-500/5"}`} />
        <div className={`absolute bottom-0 right-0 ${isDark ? "text-white/5" : "text-blue-500/5"}`}>
          <Gem size={180} />
        </div>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] ${
              isDark ? "bg-white/10 text-orange-300" : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
            }`}>
              <Crown size={14} />
              {membershipIsActive ? `${currentMembership.planName} Workspace` : "Premium Workspace"}
            </div>
            <h2 className={`max-w-2xl text-3xl font-black leading-tight lg:text-4xl ${isDark ? "text-white" : "text-[#07122b]"}`}>
              Your content operating system is ready.
            </h2>
            <p className={`mt-4 max-w-2xl text-sm leading-7 lg:text-base ${isDark ? "text-white/70" : "text-slate-500"}`}>
              This dashboard now reflects your live strategy library, active plan state,
              and Razorpay-ready checkout flow so returning users can jump straight back
              into planning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleNewStrategy}
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
              >
                Create New Strategy
              </button>
              <button
                onClick={() => setActiveTab("Plans")}
                className={`rounded-2xl px-6 py-3 text-sm font-black transition-all hover:-translate-y-0.5 ${
                  isDark ? "border border-white/15 bg-white/5 text-white hover:bg-white/10" : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Open Content Plans
              </button>
            </div>
            <div className={`mt-6 flex flex-wrap gap-3 text-xs font-bold ${isDark ? "text-white/70" : "text-slate-500"}`}>
              <div className={`rounded-full px-4 py-2 ${isDark ? "border border-white/10 bg-white/5" : "border border-slate-200 bg-slate-50"}`}>
                {currentMembership.planName} plan
              </div>
              <div className={`rounded-full px-4 py-2 ${isDark ? "border border-white/10 bg-white/5" : "border border-slate-200 bg-slate-50"}`}>
                {remainingCredits}/{creditLimit} credits left
              </div>
              <div className={`rounded-full px-4 py-2 ${isDark ? "border border-white/10 bg-white/5" : "border border-slate-200 bg-slate-50"}`}>
                {getSyncLabel()}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {liveHighlights.map((item) => (
              <div
                key={item.title}
                className={`rounded-[28px] p-5 backdrop-blur-sm ${
                  isDark ? "border border-white/10 bg-white/5" : "border border-slate-100 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? "text-orange-300" : "text-orange-500"}`}>
                      {item.title}
                    </p>
                    <p className={`mt-2 text-sm font-medium leading-6 ${isDark ? "text-white/80" : "text-slate-600"}`}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Ideas Stat */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigate("/ideas")}
          className="cursor-pointer relative overflow-hidden rounded-[38px] border p-8 transition-all duration-300"
          style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
            <Lightbulb size={28} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: "var(--muted-text)" }}>
            Thinking Layer
          </p>
          <h3 className="text-4xl font-black" style={{ color: "var(--app-text)" }}>
            {loading ? <Skeleton className="h-10 w-20" /> : dashboardData.stats.totalIdeas}
            <span className="ml-2 text-lg font-bold opacity-40" style={{ color: "var(--muted-text)" }}>Ideas</span>
          </h3>
          {/* Subtle decoration */}
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-orange-500/5 blur-2xl" />
        </motion.div>

        {/* Content Stat */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigate("/content")}
          className="cursor-pointer relative overflow-hidden rounded-[38px] border p-8 transition-all duration-300"
          style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <FileText size={28} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: "var(--muted-text)" }}>
            Execution Layer
          </p>
          <h3 className="text-4xl font-black" style={{ color: "var(--app-text)" }}>
            {loading ? <Skeleton className="h-10 w-20" /> : dashboardData.stats.totalContents}
            <span className="ml-2 text-lg font-bold opacity-40" style={{ color: "var(--muted-text)" }}>Posts</span>
          </h3>
          {/* Subtle decoration */}
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl" />
        </motion.div>

        {/* Plans Stat */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigate("/plans")}
          className="cursor-pointer relative overflow-hidden rounded-[38px] border p-8 transition-all duration-300"
          style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
            <Workflow size={28} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: "var(--muted-text)" }}>
            Strategy Layer
          </p>
          <h3 className="text-4xl font-black" style={{ color: "var(--app-text)" }}>
            {loading ? <Skeleton className="h-10 w-20" /> : dashboardData.stats.totalPlans}
            <span className="ml-2 text-lg font-bold opacity-40" style={{ color: "var(--muted-text)" }}>Plans</span>
          </h3>
          {/* Subtle decoration */}
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-blue-500/5 blur-2xl" />
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#07122b] to-[#020617] p-8 shadow-2xl border border-white/5"
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-500/20">
                <Zap size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Credits
              </span>
            </div>
            <p className="text-sm font-medium text-white/60">Available Credits</p>
            <h3 className="mt-1 text-3xl font-black text-white">
              {loading ? "..." : remainingCredits}/{creditLimit}
            </h3>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${creditsUsedPercent}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
              />
            </div>
          </div>
          
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />
        </motion.div>
      </motion.div>



      <div className="grid gap-6 md:grid-cols-2">
        <button
          onClick={handleNewStrategy}
          className="group relative overflow-hidden rounded-[32px] border p-8 text-left transition-all hover:-translate-y-1"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--app-border)",
            boxShadow: "var(--shadow-premium)",
          }}
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-transform group-hover:rotate-12">
            <Plus size={28} />
          </div>
          <p className="text-lg font-black" style={{ color: "var(--app-text)" }}>New Strategy</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            Start with a clean onboarding session
          </p>
          {/* Subtle glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-colors" />
        </button>

        <button
          onClick={() => setActiveTab("Library")}
          className="group relative overflow-hidden rounded-[32px] border p-8 text-left transition-all hover:-translate-y-1"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--app-border)",
            boxShadow: "var(--shadow-premium)",
          }}
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:-rotate-12">
            <Bookmark size={28} />
          </div>
          <p className="text-lg font-black" style={{ color: "var(--app-text)" }}>Idea Bank</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            Stored content assets and saved outputs
          </p>
          {/* Subtle glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
        </button>
      </div>

      <section className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-grow w-full xl:w-[65%] rounded-[42px] border p-6 md:p-8 lg:p-10 transition-all duration-300"
             style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-500">
                Membership Plans
              </p>
              <h3 className="mt-2 text-2xl font-black" style={{ color: "var(--app-text)" }}>
                Choose a premium growth plan
              </h3>
            </div>

            <div className="rounded-2xl px-4 py-2 text-sm font-black" style={{ background: "var(--soft-bg)", color: "var(--muted-text)" }}>
              {currentMembership?.planName || "Starter"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch py-12">
            {membershipPlans.map((plan, idx) => (
              <PricingCard
                key={plan.planId}
                index={idx}
                plan={plan}
                variant={plan.featured ? "featured" : "subtle"}
                currentMembership={currentMembership}
                onUpgrade={handleUpgradePlan}
                isProcessing={processingPlanId === plan.planId}
              />
            ))}
          </div>


        </div>

        <div className="w-full xl:w-[35%] space-y-6">
          <div className="rounded-[42px] border p-8 transition-all duration-300"
               style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-500">
              Payment Methods
            </p>
            <h3 className="mt-2 text-2xl font-black" style={{ color: "var(--app-text)" }}>
              Razorpay-ready checkout options
            </h3>
            <div className="mt-6 space-y-4">
              {paymentMethods.map(({ title, detail, Icon, tone, textColor }) => (
                <div key={title} className="rounded-[24px] border border-[var(--app-border)] bg-[var(--soft-bg)] p-5 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--card-bg)] border border-[var(--app-border)] shadow-sm">
                      <Icon size={22} className={textColor} />
                    </div>
                    <div>
                      <p className={`text-sm font-black uppercase tracking-[0.18em] ${textColor}`}>
                        {title}
                      </p>
                      <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted-text)" }}>
                        {detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[42px] bg-gradient-to-br from-orange-600 to-orange-400 p-8 text-white shadow-[0_25px_60px_rgba(249,115,22,0.2)] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/80">
                    Membership Status
                  </p>
                  <h3 className="mt-2 text-2xl font-black">
                    {currentMembership?.planName || "Starter"} is active
                  </h3>
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                  {membershipIsActive ? "Live" : "Starter"}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/85">
                {membershipIsActive
                  ? `Verified payments are activating your ${currentMembership.planName} workspace server-side before access updates in the app.`
                  : "Starter access is live now, and your paid upgrade flow is ready to activate directly from this dashboard."}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                    Last Payment
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {lastPayment ? formatShortDate(lastPayment.createdAt) : "No invoice yet"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                    Payment Method
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {currentMembership?.paymentMethod || "Razorpay Ready"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                    Plan Started
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {formatShortDate(currentMembership?.startedAt)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                    Dashboard Sync
                  </p>
                  <p className="mt-2 text-sm font-bold">{getSyncLabel()}</p>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
               <Rocket size={200} />
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-[38px] border transition-all duration-300"
           style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
        <div className="flex items-center justify-between border-b p-8" style={{ borderColor: "var(--app-border)" }}>
          <h3 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Recent Activity</h3>
          <button
            onClick={() => setActiveTab("Activity")}
            className="rounded-xl p-2 transition-colors hover:bg-white/5"
          >
            <MoreHorizontal size={20} style={{ color: "var(--muted-text)" }} />
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--app-border)" }}>
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            recentItems.map((item, idx) => {
              const { Icon, color, bg } = getActivityIcon(item, idx);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-6 transition-colors hover:bg-[var(--soft-bg)]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                      style={{ background: bg }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--app-text)" }}>
                        {item.title}
                      </p>
                      <p className="text-xs font-medium" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
                        {item.plan
                          ? "Full Strategy"
                          : item.isDailyPlan
                            ? `Day ${item.day} Strategy`
                            : "Creative Concept"}{" "}
                        • {getTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (item.plan) {
                        navigate("/WeeklyPlanPage", {
                          state: {
                            plan: item.plan,
                            selectedIdea: item.selectedIdea || item.idea || {},
                            onboardingData: item.onboardingData || {},
                          },
                        });
                      } else {
                        navigate("/idea", {
                          state: {
                            selectedIdea: item.idea || item,
                            onboardingData: item.onboardingData || userData?.onboardingData || {},
                          },
                        });
                      }
                    }}
                    className="transition-colors hover:text-orange-500"
                    style={{ color: "var(--muted-text)" }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })
          )}
          {!loading && recentItems.length === 0 ? (
            <div className="p-12 text-center text-sm italic" style={{ color: "var(--muted-text)", opacity: 0.5 }}>
              No recent activity to display.
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );

  const renderLibrary = () => (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative w-full md:max-w-md"
      >
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted-text)", opacity: 0.5 }}
        />
        <input
          type="text"
          placeholder="Search saved ideas..."
          className="w-full rounded-[22px] border py-4 pl-12 pr-6 outline-none transition-all shadow-sm focus:ring-4 focus:ring-orange-500/5 font-medium"
          style={{ 
            background: "var(--card-bg)", 
            borderColor: "var(--app-border)", 
            color: "var(--app-text)" 
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))
        ) : dashboardData.ideas.length > 0 ? (
          dashboardData.ideas.map((idea) => (
            <motion.div 
              key={idea._id} 
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <SavedIdeaCard
                idea={idea}
                onRemove={() => handleRemoveIdea(idea._id)}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Bookmark className="mx-auto h-12 w-12 opacity-20" style={{ color: "var(--muted-text)" }} />
            <p className="mt-4 italic" style={{ color: "var(--muted-text)", opacity: 0.5 }}>No saved ideas yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[42px] border p-8 shadow-[0_30px_70px_-15px_rgba(7,18,43,0.3)] ${
          isDark ? "text-white border-slate-800" : "bg-white text-[#07122b] border-slate-200"
        }`}
        style={isDark ? { background: "linear-gradient(135deg, #07122b 0%, #0f1f3a 100%)" } : {}}
      >
        <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-orange-500/10" : "bg-orange-500/5"}`} />
        <div className={`absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
        
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm ${
              isDark ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-600"
            }`}>
              <Zap size={12} fill="currentColor" /> Strategic Hub
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">Your Strategic Command Center</h2>
            <p className={`mt-3 max-w-xl text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-500"}`}>
              Manage your 7-day roadmaps and individual post strategies. Premium features like bulk export and AI-driven optimizations are active for Pro members.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:shrink-0">
            <div className={`flex flex-col justify-center rounded-[28px] px-6 py-5 backdrop-blur-md shadow-inner ${
              isDark ? "bg-white/5 border border-white/10 shadow-white/5" : "bg-slate-50 border border-slate-100 shadow-slate-200/50"
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-400"}`}>Active Tier</p>
              <p className="mt-1.5 text-xl font-black flex items-center gap-2">
                {currentMembership?.planName || "Starter"}
                {(currentMembership?.planId === "pro" || currentMembership?.planId === "studio") && <Crown size={18} className="text-orange-400" />}
              </p>
            </div>
            <div className={`flex flex-col justify-center rounded-[28px] px-6 py-5 backdrop-blur-md shadow-inner ${
              isDark ? "bg-white/5 border border-white/10 shadow-white/5" : "bg-slate-50 border border-slate-100 shadow-slate-200/50"
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-400"}`}>Billing State</p>
              <p className="mt-1.5 text-xl font-black text-blue-500 flex items-center gap-2">
                <CreditCard size={18} /> {currentMembership?.paymentMethod || "Razorpay Active"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-[40px]" />
          ))
        ) : allPlans.length > 0 ? (
          allPlans.map((item, index) => {
          const isFull = item.isFullPlan;
          return (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                y: -8, 
                scale: 1.01,
                boxShadow: isFull 
                  ? "0 30px 60px -15px rgba(7, 18, 43, 0.4)" 
                  : "0 20px 40px -12px rgba(244, 124, 53, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isFull) {
                  navigate("/WeeklyPlanPage", {
                    state: {
                      plan: item.plan,
                      selectedIdea: item.selectedIdea || item.idea || item,
                      onboardingData: item.onboardingData || userData?.onboardingData || {},
                      fromDashboard: true,
                    },
                  });
                } else {
                  navigate(item.isDailyPlan ? "/PlanView" : "/WeeklyPlanPage", {
                    state: {
                      selectedIdea: item.selectedIdea || item.idea || item,
                      onboardingData: item.onboardingData || userData?.onboardingData || {},
                      fromDashboard: true,
                    },
                  });
                }
              }}
              className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[38px] border p-7 transition-all duration-300 min-h-[280px] ${
                isFull 
                  ? "border-slate-800 bg-gradient-to-br from-[#07122b] to-[#0f1f3a] text-white shadow-xl shadow-slate-900/20" 
                  : "bg-[var(--card-bg)] text-[var(--app-text)] shadow-[var(--shadow-premium)]"
              }`}
              style={!isFull ? { borderColor: "var(--app-border)" } : {}}
            >
              <div>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[20px] shadow-sm ${
                    isFull 
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30 border border-orange-400/50" 
                      : "bg-[var(--soft-bg)] text-blue-400 border border-[var(--app-border)]"
                  }`}>
                    {isFull ? <CalendarDays size={22} /> : <Zap size={22} />}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isFull ? handleRemovePlan(item._id) : handleRemoveIdea(item._id);
                    }}
                    className={`rounded-xl p-2.5 transition-colors ${
                      isFull ? "bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3 relative z-10">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
                    isFull ? "bg-white/10 text-orange-300 border border-white/5" : "bg-[var(--soft-bg)] text-blue-400 border border-[var(--app-border)]"
                  }`}>
                    {isFull ? "Strategic Roadmap" : "Daily Concept"}
                  </span>
                  <h4 className={`text-[19px] font-black leading-snug line-clamp-3 pr-2 ${isFull ? "text-white" : "text-[var(--app-text)]"}`}>
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-5 mt-6 border-t relative z-10 ${isFull ? "border-white/10" : "border-[var(--app-border)]"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${isFull ? "bg-orange-500" : "bg-blue-400"}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isFull ? "text-slate-400" : "text-[var(--muted-text)]"}`}>
                      {item.platform || "Multi-Channel"}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-bold ${isFull ? "text-slate-400" : "text-[var(--muted-text)]"}`}>
                  {formatShortDate(item.createdAt)}
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${
                    isFull ? "bg-white/10 text-white" : "bg-[var(--soft-bg)] text-[var(--muted-text)] border border-[var(--app-border)]"
                  }`}>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>

              {isFull && (
                <>
                  <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-colors pointer-events-none" />
                  <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
                </>
              )}
            </motion.div>
          );
        })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 rounded-[42px] border border-dashed"
               style={{ background: "rgba(255,255,255,0.01)", borderColor: "var(--app-border)" }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm mb-4"
                 style={{ background: "var(--card-bg)", color: "var(--muted-text)", opacity: 0.3 }}>
              <CalendarDays size={28} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: "var(--app-text)" }}>No Content Plans Yet</h3>
            <p className="mt-2 text-sm max-w-sm text-center" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
              Generate a weekly strategic roadmap or a daily concept to see them appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );



  const renderActivity = () => (
    <div className="space-y-6">
      <div className="rounded-[45px] border p-10 transition-all duration-300"
           style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
        <div className="mb-10">
          <h2 className="text-2xl font-black" style={{ color: "var(--app-text)" }}>
            Generation History
          </h2>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.6 }}>
            Full log of your content engineering
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : (
            [...dashboardData.ideas, ...dashboardData.plans]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((item, idx) => {
                const { Icon, color, bg } = getActivityIcon(item, idx);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 10 }}
                    className="group flex items-center justify-between rounded-[30px] border p-5 transition-all hover:shadow-lg hover:shadow-orange-500/5"
                    style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)" }}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
                           style={{ background: bg }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black" style={{ color: "var(--app-text)" }}>{item.title}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-widest"
                                style={{ 
                                  background: item.plan ? "rgba(59,130,246,0.1)" : "rgba(249,115,22,0.1)",
                                  color: item.plan ? "#60a5fa" : "#fb923c"
                                }}>
                            {item.plan ? "Full Strategy" : "Concept Idea"}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                            • {getTimeAgo(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => item.plan ? handleRemovePlan(item._id) : handleRemoveIdea(item._id)}
                        className="p-2 transition-colors hover:text-red-500"
                        style={{ color: "var(--muted-text)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );

  const renderSettingsPreview = () => (
    <div className="max-w-3xl">
      <div className="space-y-12 rounded-[45px] border p-10 transition-all duration-300"
           style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
        <section>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-black" style={{ color: "var(--app-text)" }}>
            <User className="text-orange-500" size={24} /> Profile Intelligence
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              readOnly
              value={userName}
              className="w-full rounded-2xl border px-6 py-4 font-bold outline-none"
              style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
            />
            <input
              type="text"
              readOnly
              value={userData?.email || "..."}
              className="w-full rounded-2xl border px-6 py-4 font-bold outline-none"
              style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-6 flex items-center gap-3 text-xl font-black" style={{ color: "var(--app-text)" }}>
            <Star className="text-blue-500" size={24} /> Subscription Snapshot
          </h3>
          <div className={`rounded-[32px] p-8 ${
            isDark ? "bg-gradient-to-br from-[#07122b] to-[#1a2b4b] text-white" : "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-[#07122b]"
          }`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/60" : "text-slate-400"}`}>
              Active Membership
            </p>
            <h4 className="mt-2 text-4xl font-black">
              {currentMembership?.planName || "Starter"}
            </h4>
            <p className={`mt-4 text-sm leading-7 ${isDark ? "text-white/70" : "text-slate-500"}`}>
              Payment method: {currentMembership?.paymentMethod || "Not added yet"}
            </p>
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-sm font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white border border-red-500/20"
          style={{ background: "var(--danger-soft)" }}
        >
          <LogOut size={20} /> Deauthorize Session
        </button>
      </div>
    </div>
  );

  if (loading && !dashboardData.ideas.length && !dashboardData.plans.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-orange-500" size={48} />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse" style={{ color: "var(--muted-text)" }}>
            Initializing Strategic Node...
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 1.01 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {(() => {
          switch (activeTab) {
            case "Overview": return renderOverview();
            case "Library": return renderLibrary();
            case "Plans": return renderPlans();
            case "Activity": return renderActivity();
            case "Settings": return renderSettingsPreview();
            default: return renderOverview();
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );


  const tabTitles = {
    Overview: `Welcome back, ${userName}!`,
    Library: "Idea Library",
    Plans: "Content Plans",
    Activity: "Activity Logs",
    Settings: "Settings",
  };

  const tabDescriptions = {
    Overview: "Get a bird's-eye view of your content ecosystem and recent growth.",
    Library: "Access your curated list of high-potential content concepts.",
    Plans: "Manage your strategic 7-day roadmaps and detailed post strategies.",
    Activity: "Track your content engineering history and recent actions.",
    Settings: "Manage your profile, preferences, and membership details.",
  };

  return (
    <WorkspaceShell
      badge={activeTab === "Overview" ? "Strategic AI Environment" : "Dashboard"}
      title={tabTitles[activeTab]}
      description={tabDescriptions[activeTab]}
      dashboardSection={activeTab}
      hideWorkflow={true}
      shellVariant="dashboard"
    >
      <div className="relative">{renderContent()}</div>
    </WorkspaceShell>
  );
};

export default DashboardPage;
