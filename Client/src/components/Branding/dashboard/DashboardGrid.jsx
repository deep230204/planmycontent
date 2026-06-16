import SavedIdeaCard from "./SavedIdeaCard";

const defaultIdeas = [
  {
    title: "5 AI Tools Students Should Use in 2026",
    description:
      "Create a carousel post explaining the best AI tools for productivity, studying, and side hustles.",
    platform: "Instagram",
    date: "2 hours ago",
    tags: ["AI", "Students", "Productivity"],
  },
  {
    title: "How to Grow on LinkedIn in 30 Days",
    description:
      "Share practical steps for building a personal brand and increasing profile engagement quickly.",
    platform: "LinkedIn",
    date: "5 hours ago",
    tags: ["LinkedIn", "Growth", "Personal Brand"],
  },
  {
    title: "Top 10 Side Hustles for College Students",
    description:
      "A short-form video idea explaining the best online side hustles for students in 2026.",
    platform: "YouTube",
    date: "1 day ago",
    tags: ["Money", "Students", "Side Hustle"],
  },
];

const DashboardGrid = ({ ideas = defaultIdeas }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Recent Content Ideas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore your recently saved content ideas and strategies
          </p>
        </div>

        <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-all duration-300">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <SavedIdeaCard key={index} idea={idea} />
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;
