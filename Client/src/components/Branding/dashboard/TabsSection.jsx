const tabs = [
  "All Ideas",
  "Saved Ideas",
  "Content Plans",
  "Trending",
  "Published",
];

const TabsSection = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
            index === 0
              ? "bg-orange-500 text-white border-orange-500 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabsSection;