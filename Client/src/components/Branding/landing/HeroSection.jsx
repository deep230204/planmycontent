import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleHeroCTA = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      navigate("/signup");
      return;
    }

    if (user && !user.isOnboarded) {
      navigate("/onboarding");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-14 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-20 text-center overflow-hidden animate-fadeIn">
      <div className="absolute top-10 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#f47c35]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-20 sm:top-32 right-0 sm:right-10 w-52 sm:w-80 h-52 sm:h-80 bg-[#07122b]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[400px] md:w-[500px] h-[180px] sm:h-[240px] md:h-[300px] bg-[#f47c35]/5 rounded-full blur-3xl"></div>

      <div className="absolute left-4 top-48 hidden xl:flex flex-col gap-4">
        {/* <div className="animate-[float_4s_ease-in-out_infinite] rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
          <p className="text-xs font-medium text-[#64748b]">
            Weekly Content Plan
          </p>
          <p className="mt-2 text-lg font-bold text-[#07122b]">
            +350% Engagement
          </p>
        </div> */}

        {/* <div className="animate-[float_4s_ease-in-out_infinite] [animation-delay:1s] rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
          <p className="text-xs font-medium text-[#64748b]">
            AI Strategy Score
          </p>
          <p className="mt-2 text-lg font-bold text-[#f47c35]">98/100</p>
        </div> */}
      </div>

      <div className="absolute right-4 top-48 hidden xl:flex flex-col gap-4">
        {/* <div className="animate-[float_4s_ease-in-out_infinite] [animation-delay:0.5s] rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
          <p className="text-xs font-medium text-[#64748b]">
            Ideas Generated
          </p>
          <p className="mt-2 text-lg font-bold text-[#07122b]">10K+</p>
        </div> */}

        {/* <div className="animate-[float_4s_ease-in-out_infinite] [animation-delay:1.5s] rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
          <p className="text-xs font-medium text-[#64748b]">
            Active Creators
          </p>
          <p className="mt-2 text-lg font-bold text-[#f47c35]">5,000+</p>
        </div> */}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 rounded-full border border-[#f47c35]/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 shadow-sm flex items-center gap-2 hover:border-[#f47c35]/40 transition-colors duration-300">
          <Lightbulb className="h-4 w-4 text-[#f47c35] fill-amber-300 drop-shadow-[0_0_6px_rgba(244,124,53,0.6)] animate-pulse" />
          AI Powered Content Planning Platform
        </div>

        <p className="text-[#f47c35] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base font-medium mb-6 sm:mb-8">
          CONTENT STRATEGY, BUILT FOR YOU
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-8 sm:mb-10 max-w-4xl px-2 text-slate-900 dark:text-white">
          Not just ideas.
          <br />
          <span className="bg-gradient-to-r from-[#f47c35] via-[#ff9a5a] to-[#ffb36c] bg-clip-text text-transparent">
            Strategic content
          </span>{" "}
          that works.
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 sm:mb-12 px-2">
          Tell us about your brand, and we'll think like your content strategist
          — generating ideas and weekly plans that actually move the needle.
        </p>

        <div className="hidden lg:flex animate-[float_6s_ease-in-out_infinite] items-center gap-4 rounded-[28px] border border-white/60 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-3xl px-5 py-5 mb-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47c35]/10 text-[#f47c35]">
            <CalendarDays size={26} />
          </div>

          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400 dark:text-slate-400">
              Weekly Content Calendar
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              12 AI Generated Ideas Ready
            </h3>
          </div>

          <div className="h-10 w-px bg-[#e2e8f0] dark:bg-slate-800"></div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              <Sparkles size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Viral Score</p>
              <p className="font-bold text-slate-900 dark:text-white">92%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f47c35]/10 text-[#f47c35]">
              <TrendingUp size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Engagement Forecast</p>
              <p className="font-bold text-[#f47c35]">+240%</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleHeroCTA}
          className="group animate-fadeIn w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#f47c35] to-[#ff9a5a] hover:from-[#ea6d24] hover:to-[#ff8f4c] text-white text-sm sm:text-base md:text-xl font-semibold px-12 py-5 rounded-2xl shadow-[0_10px_30px_rgba(244,124,53,0.35)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(244,124,53,0.45)] mb-8"
        >
          Generate My Content Strategy
          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1 sm:w-[22px] sm:h-[22px]"
          />
        </button>

        <div className="mt-2 flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
            <div className="h-10 w-10 rounded-full border-2 border-white bg-[#f47c35]"></div>
            <div className="h-10 w-10 rounded-full border-2 border-white bg-[#07122b]"></div>
            <div className="h-10 w-10 rounded-full border-2 border-white bg-[#ff9a5a]"></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-semibold">
              +5K
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#64748b]">
            Trusted by 5,000+ creators, founders and brands
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
