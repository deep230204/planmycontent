import {
  ArrowRight,
  CalendarDays,
  Lightbulb,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardPreview() {
  const navigate = useNavigate();

  const handlePreviewDashboard = () => {
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
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#f47c35]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#07122b]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center mb-12 sm:mb-14 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f47c35]/20 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-medium text-[#07122b] dark:text-white shadow-sm mb-6">
          <BarChart3 className="h-4 w-4 text-[#f47c35]" />
          Real-Time Dashboard Experience
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 px-2 text-[#07122b] dark:text-white">
          See Your Strategy
          <br />
          <span className="bg-gradient-to-r from-[#f47c35] via-[#ff9a5a] to-[#ffb36c] bg-clip-text text-transparent">
            In Action
          </span>
        </h2>

        <p className="text-[#64748b] text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">
          Preview your content ideas, weekly plans, audience insights, saved
          strategies, and growth analytics in one clean dashboard.
        </p>
      </div>

      <div className="relative z-10 rounded-[28px] sm:rounded-[36px] border border-white/60 dark:border-white/10 bg-white/75 dark:bg-[var(--card-bg)] backdrop-blur-3xl p-5 sm:p-8 md:p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          <div className="group rounded-[28px] border border-white/60 dark:border-white/10 bg-[#f8fafc]/80 dark:bg-[var(--soft-bg)] backdrop-blur-xl p-5 sm:p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47c35]/10 text-[#f47c35] group-hover:bg-[#f47c35] group-hover:text-white transition-all duration-300">
                <Lightbulb size={26} />
              </div>

              <span className="rounded-full bg-[#f47c35]/10 px-4 py-2 text-xs font-semibold text-[#f47c35]">
                10+ Ideas
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#64748b] mb-2">
              Weekly Topics
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#07122b] dark:text-white">
              10 Content Ideas
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm text-sm sm:text-[15px] text-[#07122b] dark:text-white">
                Morning routine for founders
              </div>

              <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm text-sm sm:text-[15px] text-[#07122b] dark:text-white">
                3 mistakes killing your engagement
              </div>

              <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm text-sm sm:text-[15px] text-[#07122b] dark:text-white">
                How to create better hooks
              </div>
            </div>
          </div>

          <div className="group rounded-[28px] border border-white/60 dark:border-white/10 bg-[#f8fafc]/80 dark:bg-[var(--soft-bg)] backdrop-blur-xl p-5 sm:p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47c35]/10 text-[#f47c35] group-hover:bg-[#f47c35] group-hover:text-white transition-all duration-300">
                <CalendarDays size={26} />
              </div>

              <span className="rounded-full bg-[#07122b]/5 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-[#07122b] dark:text-white">
                This Week
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#64748b] mb-2">
              7-Day Plan
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#07122b] dark:text-white">
              Content Calendar
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm">
                <span className="font-medium text-sm sm:text-base text-[#07122b] dark:text-white">
                  Monday
                </span>
                <span className="rounded-full bg-[#f47c35]/10 px-3 py-1 text-[#f47c35] font-semibold text-sm">
                  Reel
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm">
                <span className="font-medium text-sm sm:text-base text-[#07122b] dark:text-white">
                  Wednesday
                </span>
                <span className="rounded-full bg-[#f47c35]/10 px-3 py-1 text-[#f47c35] font-semibold text-sm">
                  Carousel
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] px-4 py-3 shadow-sm">
                <span className="font-medium text-sm sm:text-base text-[#07122b] dark:text-white">
                  Friday
                </span>
                <span className="rounded-full bg-[#f47c35]/10 px-3 py-1 text-[#f47c35] font-semibold text-sm">
                  Story
                </span>
              </div>
            </div>
          </div>

          <div className="group rounded-[28px] border border-white/60 dark:border-white/10 bg-[#f8fafc]/80 dark:bg-[var(--soft-bg)] backdrop-blur-xl p-5 sm:p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47c35]/10 text-[#f47c35] group-hover:bg-[#f47c35] group-hover:text-white transition-all duration-300">
                <BarChart3 size={26} />
              </div>

              <span className="rounded-full bg-[#16a34a]/10 px-4 py-2 text-xs font-semibold text-[#16a34a]">
                +240%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#64748b] mb-2">
              Performance
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#07122b] dark:text-white">
              Growth Score
            </h3>

            <div className="rounded-[24px] border border-[#ffe1cf] dark:border-orange-500/20 bg-[#fff4ec] dark:bg-orange-500/10 p-6 sm:p-8 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp size={22} className="text-[#f47c35]" />
                <h4 className="text-5xl sm:text-6xl font-extrabold text-[#f47c35]">
                  92%
                </h4>
              </div>

              <p className="text-sm sm:text-base text-[#64748b] leading-relaxed">
                Based on audience fit, content mix, posting consistency, and
                engagement quality.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10 sm:mt-12">
          <button
            onClick={handlePreviewDashboard}
            className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#f47c35] to-[#ff9a5a] text-white text-sm sm:text-base font-semibold shadow-[0_10px_30px_rgba(244,124,53,0.35)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(244,124,53,0.45)] transition-all duration-300"
          >
            Preview Full Dashboard
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
