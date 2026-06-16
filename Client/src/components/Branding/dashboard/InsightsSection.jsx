import { TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react";

const defaultInsights = [
  {
    title: "Instagram ideas perform 35% better",
    description:
      "Your Instagram-focused content gets more saves and engagement compared to other platforms.",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Most saved category is AI Content",
    description:
      "AI-related posts are currently the most saved and most viewed content in your dashboard.",
    icon: Lightbulb,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "You created 12 ideas this week",
    description:
      "Your content generation activity has increased by 18% compared to last week.",
    icon: BarChart3,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Best posting time is 7 PM",
    description:
      "Your audience engagement is highest in the evening between 6 PM and 8 PM.",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
  },
];

const iconCycle = [TrendingUp, Lightbulb, BarChart3, Target];
const colorCycle = [
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-blue-100 text-blue-600",
];

const InsightsSection = ({ insights = defaultInsights }) => {
  return (
    <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Smart Insights
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Personalized analytics and recommendations based on your content activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((item, index) => {
          const Icon = item.icon || iconCycle[index % iconCycle.length];
          const color = item.color || colorCycle[index % colorCycle.length];

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[var(--soft-bg)] p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsSection;
