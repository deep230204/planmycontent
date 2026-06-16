import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Zap, ArrowRight } from "lucide-react";

/**
 * 10/10 Premium SaaS Pricing Card with Framer Motion
 * Features: Floating animations, staggered entrance, and dynamic interaction feedback.
 */
const PricingCard = ({ plan, currentMembership, onUpgrade, isProcessing, variant = "default", index = 0 }) => {
  const isCurrent = currentMembership?.planId === plan.planId;
  const isFeatured = variant === "featured";
  const isSubtle = variant === "subtle";
  const isStarter = plan.planId === "starter";

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }
    },
    hover: { 
      y: -10, 
      scale: isFeatured ? 1.08 : 1.04,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
  };

  const glowVariants = {
    idle: {
      scale: [1, 1.1, 1],
      opacity: [0.2, 0.3, 0.2],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const getButtonStyles = () => {
    if (isCurrent) return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default opacity-80";
    if (isProcessing) return "bg-white/5 text-[var(--muted-text)] cursor-wait opacity-50";
    if (isFeatured) return "bg-orange-500 text-white shadow-[0_10px_30px_-5px_rgba(249,115,22,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(249,115,22,0.5)] transition-all duration-300";
    return "bg-[var(--card-bg)] text-[var(--app-text)] border border-[var(--app-border)] hover:border-orange-500/30 hover:bg-[var(--soft-bg)] shadow-sm transition-all duration-300";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="group relative flex flex-col h-full"
    >
      {/* Dynamic Glow Layer (Featured Only) */}
      {isFeatured && (
        <motion.div 
          variants={glowVariants}
          animate="idle"
          className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-amber-300/30 rounded-[2.5rem] blur-3xl z-0 dark:from-orange-500/20 dark:to-orange-300/10" 
        />
      )}

      {/* Main Card Container */}
      <div
        className={`
          relative flex flex-col h-full w-full p-8 rounded-[2rem] bg-[var(--card-bg)] backdrop-blur-sm z-10
          transition-all duration-500
          ${
            isFeatured
              ? "border-2 border-orange-500/80 shadow-[0_30px_60px_-15px_rgba(244,124,53,0.15)] ring-1 ring-orange-500/20"
              : "border border-[var(--app-border)] shadow-[var(--shadow-premium)]"
          }
        `}
      >
        {/* Modern Pill Badge */}
        {isFeatured && (
          <div className="absolute -top-3.5 right-6 z-20">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.18em] px-4 py-1.5 rounded-full shadow-[0_8px_16px_-4px_rgba(244,124,53,0.4)] ring-4 ring-[var(--card-bg)]"
            >
              <Zap size={10} fill="currentColor" className="animate-pulse" />
              Most Popular
            </motion.div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl transition-colors ${isFeatured ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400' : 'bg-[var(--soft-bg)] text-[var(--muted-text)]'}`}>
              {isFeatured ? <Sparkles size={20} /> : <Zap size={20} />}
            </div>
            {isCurrent && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                Current
              </span>
            )}
          </div>
          <h4 className="text-xl font-black text-[var(--app-text)] tracking-tight leading-none mb-2">
            {plan.name}
          </h4>
          <p className="text-[13px] font-medium text-[var(--muted-text)] leading-relaxed min-h-[40px]">
            {plan.subtitle}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-8 pt-6 border-t border-[var(--app-border)]">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black tracking-tight text-[var(--app-text)]`}>
              {plan.price.split('/')[0]}
            </span>
            {!isStarter && (
              <span className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-widest opacity-60">
                / month
              </span>
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--soft-bg)] border border-[var(--app-border)] backdrop-blur-[2px]">
            <Sparkles size={12} className="text-orange-500" />
            <span className="text-[11px] font-black text-[var(--app-text)] uppercase tracking-[0.1em]">
              {plan.monthlyCredits} AI Credits
            </span>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-10 flex-grow">
          {plan.features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.05 }}
              className="flex items-start gap-3 group/item"
            >
              <div
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300
                ${
                  isFeatured
                    ? "bg-orange-500/20 text-orange-400 group-hover/item:bg-orange-500 group-hover/item:text-white"
                    : "bg-[var(--soft-bg)] text-[var(--muted-text)] group-hover/item:bg-orange-500 group-hover/item:text-white"
                }`}
              >
                <CheckCircle2 size={12} strokeWidth={3} />
              </div>
              <p className="text-sm font-semibold text-[var(--muted-text)] leading-tight group-hover/item:text-[var(--app-text)] transition-colors">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interactive CTA Button */}
        <motion.button
          whileHover={{ scale: isCurrent ? 1 : 1.05 }}
          whileTap={{ scale: isCurrent ? 1 : 0.96 }}
          onClick={() => !isCurrent && !isProcessing && onUpgrade(plan)}
          disabled={isCurrent || isProcessing}
          className={`
            relative w-full py-4 px-6 rounded-xl text-[13px] font-black uppercase tracking-widest overflow-hidden
            transition-all duration-300
            ${getButtonStyles()}
          `}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isCurrent ? "Active Membership" : isProcessing ? "Redirecting..." : (
              <>
                {plan.buttonLabel || "Start Free Trial"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
          {/* Subtle button shine effect */}
          {!isCurrent && !isProcessing && (
            <motion.div 
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
            />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
