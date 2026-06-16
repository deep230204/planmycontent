import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

function PasswordChecklist({ password }) {
  const rules = [
    {
      id: "length",
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "number",
      label: "One number",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "One special character",
      met: /[@$!%*?&]/.test(password),
    },
  ];

  return (
    <div className="bg-slate-50/80 dark:bg-[#0c1220]/80 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 mb-6">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Password Requirements
      </p>
      <div className="space-y-2.5">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center gap-2.5">
            <motion.div
              initial={false}
              animate={{
                color: rule.met ? "#22c55e" : "#475569",
                scale: rule.met ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {rule.met ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-slate-400 dark:text-slate-600" />
              )}
            </motion.div>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                rule.met
                  ? "text-slate-800 dark:text-slate-200"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PasswordChecklist;
