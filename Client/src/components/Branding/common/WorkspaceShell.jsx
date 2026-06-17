import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo1 from "../../../assets/logo1.png";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  Lock,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sparkles,
  SunMedium,
  Wand2,
  Workflow,
  X,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { getUserProfile } from "../../../utils/userProfile";

const primaryNavItems = [
  { id: "Overview", label: "Dashboard", icon: LayoutDashboard, target: { pathname: "/dashboard" } },
  { id: "Ideas", label: "Content Ideas", icon: Lightbulb, target: { pathname: "/ideas" } },
  { id: "Content", label: "My Content", icon: FileText, target: { pathname: "/content" } },
  { id: "Plans", label: "Full Content Plan", icon: Workflow, target: { pathname: "/plans" } },
  { id: "Activity", label: "Activity Logs", icon: History, target: { pathname: "/dashboard", state: { tab: "Activity" } } },
  { id: "Settings", label: "Settings", icon: Settings, target: { pathname: "/settings" } },
];

const workflowNavItems = [
  { id: "Onboarding", label: "Onboarding", icon: Wand2, target: { pathname: "/onboarding" } },
  { id: "Results", label: "Results", icon: Sparkles, target: { pathname: "/ResultPage" } },
  { id: "WeeklyPlan", label: "Weekly Plan", icon: CalendarDays, target: { pathname: "/WeeklyPlanPage" } },
];

const cardTone =
  "border border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--app-text)] transition-all duration-300";
const softCardTone =
  "border border-[var(--app-border)] bg-[var(--soft-bg)] text-[var(--app-text)] transition-all duration-300";

function WorkspaceShell({
  badge = "Premium Workspace",
  title,
  description,
  section,
  dashboardSection,
  backTo,
  backLabel = "Back",
  actions,
  hero,
  children,
  hideWorkflow = false,
  contentClassName = "",
  shellVariant = "default",
}) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const user = getUserProfile();
  const userName = user?.displayName || "Creator";
  const profileImage = user?.profileImage || "";
  const userPlan = user?.membership?.planName || "Premium Workspace";

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date()),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navigateToTarget = (target = {}) => {
    setIsSidebarOpen(false);
    if (target.state) {
      navigate(target.pathname, { state: target.state });
      return;
    }
    navigate(target.pathname);
  };

  const getWorkflowItemState = (id) => {
    const isOnboarded = !!localStorage.getItem("latestOnboardingData");
    const hasResults = !!localStorage.getItem("latestGeneratedResults");
    const hasPlan = !!localStorage.getItem("latestWeeklyPlan");

    if (id === "Onboarding") {
      if (section === "Onboarding") return "active";
      return isOnboarded ? "completed" : "active";
    }
    if (id === "Results") {
      if (!isOnboarded) return "locked";
      if (section === "Results") return "active";
      return hasResults ? "completed" : "active";
    }
    if (id === "WeeklyPlan") {
      if (!hasResults) return "locked";
      if (section === "WeeklyPlan") return "active";
      return hasPlan ? "completed" : "active";
    }
    return "locked";
  };

  const completedSteps = useMemo(() => {
    const isOnboarded = !!localStorage.getItem("latestOnboardingData");
    const hasResults = !!localStorage.getItem("latestGeneratedResults");
    const hasPlan = !!localStorage.getItem("latestWeeklyPlan");
    return [isOnboarded, hasResults, hasPlan].filter(Boolean).length;
  }, []);

  const renderAvatar = (size = "h-11 w-11") =>
    profileImage ? (
      <img
        src={profileImage}
        alt={userName}
        className={`${size} rounded-full object-cover ring-2 ring-white/50`}
      />
    ) : (
      <div
        className={`flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] text-sm font-black text-white shadow-lg shadow-orange-500/20`}
      >
        {userName.charAt(0).toUpperCase()}
      </div>
    );

  const renderNavButton = (item, activeId, type = "primary") => {
    const workflowState = type === "workflow" ? getWorkflowItemState(item.id) : null;
    const isLocked = workflowState === "locked";
    const isCompleted = workflowState === "completed";
    const isActive = type === "workflow" ? workflowState === "active" : activeId === item.id;

    return (
      <motion.button
        key={item.id}
        whileHover={!isLocked ? { x: 4 } : {}}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        disabled={isLocked}
        onClick={() => !isLocked && navigateToTarget(item.target)}
        className={`group flex w-full items-center justify-between rounded-[20px] px-4 py-3.5 text-left transition-all duration-300 ${
          isActive
            ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md dark:bg-white/[0.06]"
            : "text-[var(--muted-text)] hover:bg-orange-500/5 hover:text-[var(--app-text)] dark:hover:bg-white/[0.03]"
        } ${isLocked ? "cursor-not-allowed opacity-40" : ""}`}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} className={isActive ? "text-current" : "text-[var(--muted-text)]"} />
          <span className="text-sm font-semibold">{item.label}</span>
        </div>

        {type === "workflow" ? (
          <div className="flex items-center gap-2">
            {isCompleted && !isActive ? <CheckCircle2 size={16} className="text-emerald-500" /> : null}
            {isLocked ? <Lock size={14} className="text-[var(--muted-text)]" /> : null}
          </div>
        ) : null}
      </motion.button>
    );
  };

  const profileMenuItems = [
    {
      label: "Settings",
      sublabel: "Profile and preferences",
      icon: Settings,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Billing",
      sublabel: "Plans and payments",
      icon: CreditCard,
      onClick: () => navigate("/dashboard"),
    },
    {
      label: "Workspace",
      sublabel: "Open command center",
      icon: LayoutDashboard,
      onClick: () => navigate("/dashboard"),
    },
    {
      label: isDark ? "Light Mode" : "Dark Mode",
      sublabel: "Switch instantly",
      icon: isDark ? SunMedium : Moon,
      onClick: toggleTheme,
    },
  ];

  const dashboardSidebar = (
    <aside className={`flex h-full w-[290px] shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--sidebar-bg)] px-5 py-6 transition-all duration-500 ${
        isDark 
          ? "border-white/5 bg-[#020617] shadow-[20px_0_60px_rgba(0,0,0,0.3)]" 
          : "border-slate-200 bg-white shadow-[20px_0_60px_rgba(0,0,0,0.02)]"
      }`}
    >
      <div className="flex items-center gap-3 px-2">
        <img
          src={logo1}
          alt="PlanMyContent"
          className="w-10 h-10 object-contain flex-shrink-0 rounded-xl bg-white p-1 shadow-sm border border-slate-200/10"
        />
        <p className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          PlanMy<span className="text-[#f47c35]">Content</span>
        </p>
      </div>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden absolute top-6 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] shadow-sm transition-all hover:bg-[var(--soft-bg)] hover:text-[var(--app-text)]"
      >
        <X size={20} />
      </button>

      <div className="mt-10 flex-1 space-y-8 overflow-y-auto pr-1">
        <section>
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--muted-text)]">
            Navigation
          </p>
          <nav className="space-y-2">
            {primaryNavItems.map((item) => renderNavButton(item, dashboardSection, "primary"))}
          </nav>
        </section>

        {!hideWorkflow ? (
          <section className={`rounded-[32px] border p-5 backdrop-blur-xl ${
            isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"
          }`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-500">
                Workflow
              </p>
              <span className={`text-[10px] font-black ${isDark ? "text-white/40" : "text-slate-400"}`}>{completedSteps}/3 Done</span>
            </div>
            <div className={`mt-4 h-1.5 overflow-hidden rounded-full shadow-inner ${isDark ? "bg-white/5" : "bg-slate-200/50"}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
              />
            </div>
            <div className="mt-6 space-y-1">
              {workflowNavItems.map((item) => renderNavButton(item, section, "workflow"))}
            </div>
          </section>
        ) : null}
      </div>

      <div className={`mt-6 rounded-[32px] border p-5 backdrop-blur-xl ${
        isDark ? "border-white/5 bg-white/[0.03]" : "border-slate-100 bg-slate-50/50"
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            {renderAvatar("h-12 w-12")}
            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ${isDark ? "ring-[#020617]" : "ring-white"}`} />
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm font-black ${isDark ? "text-white" : "text-[#07122b]"}`}>{userName}</p>
            <p className={`truncate text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>{userPlan}</p>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={toggleTheme}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all cursor-pointer ${
              isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-white text-slate-400 shadow-sm border border-slate-100 hover:bg-slate-50"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={handleLogout}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              isDark ? "bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400" : "bg-white text-slate-400 shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
            }`}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );

  const defaultSidebar = (
    <aside className={`flex h-full w-72 shrink-0 flex-col border-r px-6 py-8 transition-all duration-500 ${
      isDark 
        ? "border-white/5 bg-[#020617] shadow-[20px_0_60px_rgba(0,0,0,0.3)]" 
        : "border-slate-200 bg-white shadow-[20px_0_60px_rgba(0,0,0,0.02)]"
    }`}>
      <div className="mb-10 flex items-center gap-3 px-2">
        <img
          src={logo1}
          alt="PlanMyContent"
          className="h-10 w-10 rounded-xl object-contain shadow-lg shadow-orange-500/20"
        />
        <span className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-[#07122b]"}`}>
          PlanMy<span className="text-orange-500">Content</span>
        </span>
      </div>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden absolute top-8 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--card-bg)] text-[var(--muted-text)] shadow-sm transition-all hover:bg-[var(--soft-bg)] hover:text-[var(--app-text)]"
      >
        <X size={20} />
      </button>

      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        <div>
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">
            Hub
          </p>
          <nav className="space-y-1">
            {primaryNavItems.map((item) => renderNavButton(item, dashboardSection, "primary"))}
          </nav>
        </div>

        {!hideWorkflow ? (
          <div className={`relative overflow-hidden rounded-[28px] border p-5 backdrop-blur-xl ${
            isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"
          }`}>
            <div className="mb-1 flex items-center justify-between px-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                Workflow
              </p>
              <span className={`text-[9px] font-black ${isDark ? "text-white/40" : "text-slate-400"}`}>
                {completedSteps}/3 Done
              </span>
            </div>
            <div className={`mb-5 mt-3 h-1 w-full overflow-hidden rounded-full shadow-inner ${isDark ? "bg-white/5" : "bg-slate-200/50"}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              />
            </div>
            <div className="space-y-1">
              {workflowNavItems.map((item) => renderNavButton(item, section, "workflow"))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-auto border-t border-[var(--app-border)] pt-6">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName}
                className="h-9 w-9 shrink-0 rounded-xl object-cover border border-[var(--app-border)]"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--soft-bg)] font-bold text-[var(--muted-text)]">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--app-text)]">{userName}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-text)]">
                {userPlan}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-[var(--muted-text)] transition-all hover:bg-orange-500/10 hover:text-orange-500 cursor-pointer"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-[var(--muted-text)] transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  const sidebar = shellVariant === "dashboard" ? dashboardSidebar : defaultSidebar;

  const defaultMobileHeader = (
    <>
      <div className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 backdrop-blur-xl transition-all duration-500 lg:hidden ${
        isDark ? "border-white/5 bg-[#020617]/95" : "border-slate-200 bg-white/95 shadow-sm"
      }`}>
        <div className="flex items-center gap-2">
          <img src={logo1} alt="PlanMyContent" className="h-8 w-8 object-contain" />
          <span className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-[#07122b]"}`}>
            PlanMy<span className="text-orange-500">Content</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-[var(--app-border)] bg-[var(--soft-bg)] p-2 text-[var(--muted-text)] transition-colors duration-300"
          >
            {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-[var(--app-border)] bg-[var(--soft-bg)] p-2 text-[var(--muted-text)] transition-colors duration-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className={`mb-6 rounded-[28px] sm:mb-8 sm:rounded-[32px] border border-[var(--app-border)] bg-[var(--card-bg)] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.02)] transition-colors duration-300 sm:p-8 lg:p-10`}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 dark:bg-orange-500/12 dark:text-orange-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  {badge}
                </span>
                {backTo ? (
                  <motion.button
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(backTo)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--card-bg)] px-4 py-2 text-xs font-bold text-[var(--muted-text)] shadow-sm"
                  >
                    <ArrowLeft size={14} />
                    {backLabel}
                  </motion.button>
                ) : null}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--app-text)] sm:text-3xl md:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-text)]">
                  {description}
                </p>
              ) : null}
            </div>

            {actions ? (
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                {actions}
              </div>
            ) : null}
          </div>

          {hero ? <div className="mt-2">{hero}</div> : null}
        </div>

        <div className={contentClassName}>{children}</div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-300">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>

        <AnimatePresence>
          {isSidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-full"
                onClick={(event) => event.stopPropagation()}
              >
                {sidebar}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="flex min-w-0 flex-1 flex-col">
          {shellVariant !== "dashboard" ? defaultMobileHeader : null}

          {shellVariant === "dashboard" ? (
            <>
              <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--card-bg)]/80 px-4 py-4 backdrop-blur-2xl transition-all duration-500 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-2xl font-black tracking-tight text-[var(--app-text)] sm:text-3xl">
                    {title}
                  </p>
                  <p className="mt-1 hidden text-sm text-[var(--muted-text)] md:block">
                    {description || "A premium command center for your content engine."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`hidden items-center gap-3 rounded-2xl px-4 py-2.5 md:flex ${softCardTone}`}>
                  <span className="text-sm font-bold text-[var(--muted-text)]">{todayLabel}</span>
                  <button
                    onClick={toggleTheme}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--card-bg)] text-[var(--muted-text)] transition-all duration-300 hover:scale-105 hover:text-orange-500"
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDark ? <SunMedium size={17} /> : <Moon size={17} />}
                  </button>
                </div>

                <button
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${softCardTone} hover:-translate-y-0.5 hover:text-orange-500`}
                >
                  <Bell size={18} />
                </button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                    className={`flex items-center gap-3 rounded-[22px] px-3 py-2.5 ${cardTone} hover:-translate-y-0.5 hover:border-orange-200`}
                  >
                    {renderAvatar("h-11 w-11")}
                    <div className="hidden text-left md:block">
                      <p className="text-sm font-bold text-[var(--app-text)]">Hello, {userName}</p>
                      <p className="text-xs font-semibold text-[var(--muted-text)]">{userPlan}</p>
                    </div>
                    <ChevronDown size={16} className={`text-[var(--muted-text)] transition-transform duration-300 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -right-2 sm:right-0 top-[calc(100%+12px)] z-50 w-[280px] sm:w-[320px] rounded-[28px] border border-[var(--app-border)] bg-[var(--card-bg)] p-4 shadow-[0_28px_60px_rgba(15,23,42,0.18)]"
                      >
                        <div className="flex items-center gap-3 rounded-[22px] bg-[var(--soft-bg)] p-3 border border-white/5 shadow-inner">
                          {renderAvatar("h-14 w-14")}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-[var(--app-text)]">{userName}</p>
                            <p className="mt-1 truncate text-xs font-semibold text-orange-500 drop-shadow-sm">{userPlan}</p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          {profileMenuItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => {
                                item.onClick();
                                setIsProfileMenuOpen(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300 hover:bg-[var(--soft-bg)]"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--soft-bg)] text-orange-500">
                                <item.icon size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[var(--app-text)]">{item.label}</p>
                                <p className="text-xs text-[var(--muted-text)]">{item.sublabel}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handleLogout}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--app-border)] px-4 py-3 text-sm font-semibold text-[var(--muted-text)] transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
                
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[22px] ${cardTone} lg:hidden hover:-translate-y-0.5 hover:border-orange-200`}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className={`mb-8 rounded-[32px] p-6 sm:p-8 ${cardTone}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-orange-500 dark:bg-orange-500/12 dark:text-orange-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      {badge}
                    </span>
                    {backTo ? (
                      <button
                        onClick={() => navigate(backTo)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${softCardTone}`}
                      >
                        <ArrowLeft size={14} />
                        {backLabel}
                      </button>
                    ) : null}
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-[var(--app-text)] sm:text-3xl">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-text)]">
                      {description}
                    </p>
                  ) : null}
                </div>

                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
              </div>

              {hero ? <div className="mt-6">{hero}</div> : null}
            </div>

            <div className={contentClassName}>{children}</div>
          </div>
          </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default WorkspaceShell;
