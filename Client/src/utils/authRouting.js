export const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return { token, user };
};

export const getDefaultAuthenticatedPath = (user) => {
  if (!user) {
    return "/login";
  }

  return user.isOnboarded ? "/dashboard" : "/onboarding";
};
