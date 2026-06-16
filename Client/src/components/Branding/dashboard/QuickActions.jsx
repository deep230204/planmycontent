import { Plus, Sparkles, CalendarDays, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Generate Ideas",
    description: "Create fresh content ideas instantly",
    icon: Sparkles,
    bg: "bg-orange-500",
    text: "text-white",
    link: "/onboarding",
  },
  {
    title: "Create Plan",
    description: "Build your weekly content strategy",
    icon: CalendarDays,
    bg: "",
    text: "",
    link: "/WeeklyPlanPage",
  },
  {
    title: "Saved Ideas",
    description: "View all your bookmarked ideas",
    icon: Bookmark,
    bg: "",
    text: "",
    link: "/saved-ideas",
  },
  {
    title: "New Strategy",
    description: "Start planning a new campaign",
    icon: Plus,
    bg: "",
    text: "",
    link: "/onboarding",
  },
];

const QuickActions = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Access the most important tools instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Link
              key={index}
              to={action.link}
              className={`${action.bg} dark:bg-[var(--card-bg)] ${action.text} dark:text-[var(--app-text)] rounded-3xl border border-gray-100 dark:border-white/10 p-5 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/5">
                  New
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {action.title}
              </h3>

              <p className="text-sm opacity-80 leading-relaxed">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;