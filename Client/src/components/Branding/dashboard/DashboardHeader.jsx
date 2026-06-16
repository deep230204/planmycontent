const DashboardHeader = ({
  name = "Deep",
  ideasThisWeek = 24,
  trendingScore = "89%",
  savedPlans = 12,
  topPlatform = "Instagram",
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] p-6 sm:p-8 shadow-sm">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-100 blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-50 blur-2xl opacity-70"></div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 mb-4">
            Smart Content Dashboard
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Welcome back, {name}
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            Manage your content ideas, saved plans, trending topics, and AI-powered recommendations all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 min-w-[260px]">
          <div className="rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 p-4">
            <p className="text-sm text-gray-500">Ideas This Week</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{ideasThisWeek}</h3>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[var(--soft-bg)] border border-gray-100 dark:border-white/10 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Trending Score</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{trendingScore}</h3>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[var(--soft-bg)] border border-gray-100 dark:border-white/10 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Saved Plans</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{savedPlans}</h3>
          </div>

          <div className="rounded-2xl bg-orange-500 p-4 text-white shadow-lg">
            <p className="text-sm text-orange-100">Top Platform</p>
            <h3 className="text-lg font-bold mt-1">{topPlatform}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
