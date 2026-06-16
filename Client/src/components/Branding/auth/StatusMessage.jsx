import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

function StatusMessage({ message, type = "error" }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-start gap-3 p-4 rounded-xl border ${
          isError
            ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-500/30 text-red-600 dark:text-red-400"
            : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-500/30 text-green-600 dark:text-green-400"
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
        </div>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}

export default StatusMessage;
