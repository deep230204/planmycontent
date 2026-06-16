/**
 * Returns a human-readable "time ago" string
 * @param {Date|string} date 
 * @returns {string}
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return past.toLocaleDateString();
};

/**
 * Formats numbers for stats with trend indicators
 * @param {number} current 
 * @param {number} previous 
 * @returns {object}
 */
export const getTrend = (current, previous) => {
  const diff = current - (previous || 0);
  return {
    value: Math.abs(diff),
    type: diff >= 0 ? "increase" : "decrease"
  };
};
