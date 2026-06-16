import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function PremiumButton({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  variant = "primary",
}) {
  const baseStyles =
    "relative w-full flex items-center justify-center py-4 rounded-xl font-bold text-base transition-all duration-300 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary:
      "bg-[#f47c35] hover:bg-[#ea6d24] text-white shadow-[0_8px_20px_-6px_rgba(244,124,53,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(244,124,53,0.5)] disabled:bg-[#f47c35]/60 disabled:shadow-none",
    secondary:
      "bg-white dark:bg-[#1a2540] border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#f47c35] dark:hover:border-[#f47c35] hover:text-[#f47c35] dark:hover:text-[#f47c35] disabled:border-slate-100 dark:disabled:border-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.03 }}
      whileTap={disabled || loading ? {} : { scale: 0.96 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <div className="relative flex items-center justify-center gap-2">
        {loading && <Loader2 size={20} className="animate-spin" />}
        <span className={loading ? "opacity-90" : ""}>{children}</span>
      </div>
      
      {/* Shine effect */}
      {!disabled && !loading && variant === "primary" && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
      )}
    </motion.button>
  );
}

export default PremiumButton;
