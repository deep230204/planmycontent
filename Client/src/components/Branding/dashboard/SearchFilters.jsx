import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const SearchFilters = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search content ideas, plans, or topics..."
          className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--input-bg)] py-3 pl-12 pr-4 text-sm text-gray-700 dark:text-[var(--app-text)] shadow-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-500/10 transition-all duration-300"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-gray-700 dark:text-[var(--muted-text)] shadow-sm hover:border-orange-300 hover:text-orange-500 transition-all duration-300">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        <button className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-gray-700 dark:text-[var(--muted-text)] shadow-sm hover:border-orange-300 hover:text-orange-500 transition-all duration-300">
          All Platforms
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-gray-700 dark:text-[var(--muted-text)] shadow-sm hover:border-orange-300 hover:text-orange-500 transition-all duration-300">
          Newest
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;