const USER_STORAGE_KEY = "user";
const PROFILE_IMAGE_KEY = "userProfileImage";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
  } catch (error) {
    return null;
  }
};

const readStoredProfileImage = () => localStorage.getItem(PROFILE_IMAGE_KEY) || "";

const getUserDisplayName = (user = {}) =>
  user?.name || user?.username || user?.email?.split("@")[0] || "Creator";

const updateStoredUser = (updates = {}) => {
  const current = readStoredUser() || {};
  const next = { ...current, ...updates };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
  return next;
};

const setStoredProfileImage = (value = "") => {
  const normalized = value || "";
  if (normalized) {
    localStorage.setItem(PROFILE_IMAGE_KEY, normalized);
  } else {
    localStorage.removeItem(PROFILE_IMAGE_KEY);
  }

  updateStoredUser({ profileImage: normalized });
};

const getUserProfile = () => {
  const user = readStoredUser() || {};
  const profileImage = user.profileImage || readStoredProfileImage();

  return {
    ...user,
    profileImage,
    displayName: getUserDisplayName(user),
  };
};

export {
  PROFILE_IMAGE_KEY,
  USER_STORAGE_KEY,
  getUserDisplayName,
  getUserProfile,
  readStoredProfileImage,
  readStoredUser,
  setStoredProfileImage,
  updateStoredUser,
};
