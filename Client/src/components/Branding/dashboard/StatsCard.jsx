import { Lightbulb, Bookmark, BarChart3, FileText } from "lucide-react";

const defaultStats = [
  {
    title: "Total Ideas",
    value: "128",
    change: "+12%",
    icon: Lightbulb,
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Saved Plans",
    value: "24",
    change: "+8%",
    icon: Bookmark,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Published Posts",
    value: "32",
    change: "+18%",
    icon: FileText,
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Growth Rate",
    value: "89%",
    change: "+5%",
    icon: BarChart3,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const StatsCards = ({ stats = defaultStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className={`rounded-3xl border border-gray-100 dark:border-white/10 ${item.bg} p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {item.value}
                </h3>
                <span className="inline-block mt-3 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {item.change}
                </span>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.iconBg}`}
              >
                <Icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
