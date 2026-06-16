import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

function PremiumInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  error,
  isPassword = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>

      <div
        className={`relative flex items-center rounded-xl border transition-all duration-300 ${
          isFocused
            ? "border-orange-400 ring-2 ring-orange-400/20 bg-white dark:bg-[#0c1220]"
            : error
            ? "border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-900/10"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#0c1220]"
        }`}
      >
        {Icon && (
          <div className="pl-4 pr-3 text-slate-400 dark:text-slate-500">
            <Icon
              size={18}
              className={isFocused ? "text-[#f47c35]" : ""}
            />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`w-full py-3.5 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-[15px] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--app-text)] ${
            !Icon ? "px-4" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-slate-400 dark:text-slate-500 hover:text-[#f47c35] dark:hover:text-[#f47c35] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs font-medium text-red-500 ml-1 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PremiumInput;
