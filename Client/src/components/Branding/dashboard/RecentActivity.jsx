import { Clock3, Sparkles, Bookmark, CalendarDays } from "lucide-react";

const defaultActivities = [
  {
    title: "Saved a new Instagram reel idea",
    time: "10 minutes ago",
    icon: Bookmark,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Generated 5 AI-powered content ideas",
    time: "1 hour ago",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Created a weekly content plan",
    time: "3 hours ago",
    icon: CalendarDays,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Updated your posting schedule",
    time: "Yesterday",
    icon: Clock3,
    color: "bg-green-100 text-green-600",
  },
];

const RecentActivity = ({ activities = defaultActivities }) => {
  return (
    <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your latest actions and content updates
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon || Clock3;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.color || "bg-orange-100 text-orange-600"}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>

              <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-all duration-300">
                View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
