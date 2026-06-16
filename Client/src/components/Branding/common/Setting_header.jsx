import logo1 from "../../../assets/logo1.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="animate-fadeIn relative z-50 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(244,124,53,0.05),transparent_25%),radial-gradient(circle_at_right,rgba(244,124,53,0.04),transparent_30%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 md:px-10 py-4">
        
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
          <img
            src={logo1}
            alt="Logo1"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
          />

          <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight text-center sm:text-left break-words">
            PlanMy<span className="text-[#f47c35]">Content</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto min-w-[140px] text-center px-5 sm:px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-[#f47c35] to-[#ff9a5a] text-white text-sm sm:text-base font-semibold shadow-[0_10px_25px_rgba(244,124,53,0.35)] hover:scale-105 hover:shadow-[0_15px_35px_rgba(244,124,53,0.45)] transition-all duration-300"
        >
          Home 
        </button>
      </div>
    </nav>
  );
}

export default Navbar;