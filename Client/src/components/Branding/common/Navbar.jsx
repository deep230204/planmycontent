import logo1 from "../../../assets/logo1.png";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="animate-fadeIn relative z-50 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(244,124,53,0.05),transparent_25%),radial-gradient(circle_at_right,rgba(244,124,53,0.04),transparent_30%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 md:px-10 py-4">
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
          <img
            src={logo1}
            alt="Logo1"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain flex-shrink-0 rounded-xl bg-white p-1 shadow-sm border border-slate-200/10"
          />

          <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight text-center sm:text-left break-words">
            PlanMy<span className="text-[#f47c35]">Content</span>
          </h1>
        </div>

        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="group relative overflow-hidden rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 px-3 py-2 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,124,53,0.10),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(244,124,53,0.08),transparent_45%)]"></div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f47c35] to-[#ff9a57] text-base font-bold text-white shadow-[0_10px_20px_rgba(244,124,53,0.35)]">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></div>
                </div>

                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#07122b] dark:text-white leading-none">
                      {user?.name}
                    </p>

                    <span className="rounded-full bg-gradient-to-r from-[#f47c35] to-[#ff9a57] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      PRO
                    </span>
                  </div>

                  <p className="mt-1 max-w-[150px] truncate text-[11px] text-[#64748b] dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>

                <svg
                  className={`h-4 w-4 text-[#94a3b8] transition-all duration-300 ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            <div
              className={`absolute right-0 top-[calc(100%+12px)] z-50 w-[270px] overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                showProfileMenu
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="relative overflow-hidden border-b border-[#e2e8f0] dark:border-white/10 px-5 py-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,124,53,0.10),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(244,124,53,0.08),transparent_45%)]"></div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f47c35] to-[#ff9a57] text-lg font-bold text-white shadow-[0_10px_20px_rgba(244,124,53,0.35)]">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#07122b] dark:text-white">
                        {user?.name}
                      </h3>

                      <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f47c35] to-[#ff9a57] px-2 py-0.5 text-[10px] font-semibold text-white">
                        ðŸ‘‘ PREMIUM
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-[#64748b] dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                {[
                  {
                    icon: "ðŸ“Š",
                    title: "Dashboard",
                    action: () => navigate("/dashboard"),
                  },
                  {
                    icon: "ðŸ‘¤",
                    title: "My Profile",
                  },
                  {
                    icon: "âš™ï¸",
                    title: "Account Settings",
                  },
                  {
                    icon: "ðŸ‘‘",
                    title: "Upgrade Plan",
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="group mt-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:bg-[#f8f6f3] dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f6f3] dark:bg-white/5 text-lg transition-all duration-300 group-hover:bg-white dark:group-hover:bg-white/10 group-hover:shadow-md">
                        {item.icon}
                      </span>

                      <span className="text-sm font-medium text-[#07122b] dark:text-white">
                        {item.title}
                      </span>
                    </div>

                    <span className="text-[#cbd5e1] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#94a3b8]">
                      â†’
                    </span>
                  </button>
                ))}

                <div className="my-4 border-t border-[#e2e8f0] dark:border-white/10"></div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#07122b] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(7,18,43,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_18px_40px_rgba(7,18,43,0.25)]"
                >
                  <span className="text-base">â†©</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto min-w-[140px] text-center px-5 sm:px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-[#f47c35] to-[#ff9a5a] text-white text-sm sm:text-base font-semibold shadow-[0_10px_25px_rgba(244,124,53,0.35)] hover:scale-105 hover:shadow-[0_15px_35px_rgba(244,124,53,0.45)] transition-all duration-300"
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
