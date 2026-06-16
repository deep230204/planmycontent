import { motion } from "framer-motion";
import logo1 from "../../../assets/logo1.png";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen bg-[#f8f6f3] dark:bg-[#060914] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      
      {/* Brand-related Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,124,53,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(244,124,53,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.10),transparent_40%)]" />
      
      {/* Soft Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f47c35]/15 dark:bg-[#f97316]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f47c35]/15 dark:bg-[#f97316]/15 rounded-full blur-[140px] pointer-events-none" />
      {/* Extra dark mode accent blob */}
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] hidden dark:block bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Auth Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="
          bg-white/70 dark:bg-[#111827]/80
          backdrop-blur-xl
          rounded-[24px] sm:rounded-[28px]
          shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)]
          border border-white/80 dark:border-white/10
          p-8 sm:p-10 md:p-12
          overflow-hidden
          hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)]
          transition-shadow duration-500
        ">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <img src={logo1} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-black tracking-tight text-[#07122b] dark:text-white">
                PlanMy<span className="text-[#f47c35]">Content</span>
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed max-w-[280px]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;
