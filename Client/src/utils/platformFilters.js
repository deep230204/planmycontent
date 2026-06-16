export const PLATFORM_FILTERS = [
  "All",
  "Instagram",
  "YouTube",
  "Facebook",
  "LinkedIn",
  "X/Twitter",
];

const normalizePlatform = (value = "") => {
  const normalized = String(value).trim().toLowerCase();

  if (normalized.includes("youtube") || normalized === "yt") return "YouTube";
  if (normalized.includes("facebook") || normalized === "fb") return "Facebook";
  if (normalized.includes("linkedin") || normalized.includes("linked in")) return "LinkedIn";
  if (normalized.includes("instagram") || normalized === "ig") return "Instagram";
  if (
    normalized === "x" ||
    normalized.includes("twitter") ||
    normalized.includes("x/twitter")
  ) {
    return "X/Twitter";
  }

  return value || "Instagram";
};

export const getPlatformLabel = (value = "") => normalizePlatform(value);

export const matchesPlatformFilter = (platform = "", activeFilter = "All") => {
  if (activeFilter === "All") return true;
  return normalizePlatform(platform) === activeFilter;
};
