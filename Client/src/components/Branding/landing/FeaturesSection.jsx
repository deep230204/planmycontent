import {
  Lightbulb,
  CalendarDays,
  Target,
  Zap,
  ArrowRight,
  Rocket,
} from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: <Lightbulb size={28} />,
      title: "Topic Ideas",
      description:
        "Get up to 10 strategic content ideas tailored to your brand, audience, and content goals.",
      stat: "10+ Ideas",
    },
    {
      icon: <CalendarDays size={28} />,
      title: "7-Day Plans",
      description:
        "Generate a complete weekly content roadmap with hooks, formats, captions, and posting flow.",
      stat: "7-Day Strategy",
    },
    {
      icon: <Target size={28} />,
      title: "Audience-First",
      description:
        "Every content idea is built around your audience pain points, interests, and buying intent.",
      stat: "High Conversion",
    },
    {
      icon: <Zap size={28} />,
      title: "Ready in Seconds",
      description:
        "Skip hours of brainstorming and get a premium AI-generated content system instantly.",
      stat: "Instant Results",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="absolute top-10 left-0 w-60 h-60 bg-[#f47c35]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#07122b]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center mb-14 sm:mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f47c35]/20 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-medium text-[#07122b] dark:text-white shadow-sm mb-6">
          <Rocket className="h-4 w-4 text-[#f47c35]" />
          Premium Features For Smarter Planning
        </div>

        <p className="text-[#f47c35] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base font-medium mb-4 sm:mb-5">
          Powerful Features
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 sm:mb-6 max-w-4xl mx-auto px-2 text-[#07122b] dark:text-white">
          Everything You Need
          <br />
          <span className="bg-gradient-to-r from-[#f47c35] via-[#ff9a5a] to-[#ffb36c] bg-clip-text text-transparent">
            To Plan Smarter
          </span>
        </h2>

        <p className="text-[#64748b] text-base sm:text-lg md:text-xl max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2">
          Build better content systems with AI-powered planning, audience
          targeting, strategy generation, and high-converting ideas.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-[var(--card-bg)] backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f47c35]/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#f47c35]/10 text-[#f47c35] flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#f47c35] group-hover:to-[#ff9a5a] group-hover:text-white group-hover:scale-110 shadow-sm">
                {feature.icon}
              </div>

              <div className="rounded-full bg-[#f47c35]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#f47c35]">
                {feature.stat}
              </div>
            </div>

            <h3 className="relative z-10 text-2xl sm:text-3xl font-bold text-[#07122b] dark:text-white mb-4">
              {feature.title}
            </h3>

            <p className="relative z-10 text-[#64748b] text-base sm:text-lg leading-relaxed mb-8">
              {feature.description}
            </p>

            {/* <div className="relative z-10 flex items-center gap-2 text-[#07122b] font-semibold group-hover:text-[#f47c35] transition-colors duration-300">
              Learn More
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
