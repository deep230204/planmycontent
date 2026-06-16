import logo1 from "../../../assets/logo1.png";
import { Settings, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-sm">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(244,124,53,0.08),transparent_25%),radial-gradient(circle_at_right,rgba(244,124,53,0.06),transparent_30%)]"></div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white dark:bg-white/10 p-2 shadow-sm border border-gray-100 dark:border-white/10">
            <img
              src={logo1}
              alt="PlanMyContent Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07122b] dark:text-white">
              PlanMy<span className="text-[#f47c35]">Content</span>
            </h1>
            <p className="hidden sm:block text-xs text-gray-500 mt-0.5">
              Smart AI Content Planner
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;