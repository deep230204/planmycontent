const ONBOARDING_DRAFT_PREFIX = "pmc_onboarding_draft";

const getDraftKey = (email) => {
  const normalizedEmail = (email || "guest").trim().toLowerCase();
  return `${ONBOARDING_DRAFT_PREFIX}:${normalizedEmail}`;
};

export const getEmptyOnboardingForm = () => ({
  brandBasic: {},
  audience: {},
  goals: {},
  voice: {},
  content: {},
  keywords: {},
  challenges: {},
});

export const loadOnboardingDraft = (email) => {
  try {
    const raw = localStorage.getItem(getDraftKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to load onboarding draft:", error);
    return null;
  }
};

export const saveOnboardingDraft = (email, data) => {
  try {
    localStorage.setItem(getDraftKey(email), JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save onboarding draft:", error);
  }
};

export const clearOnboardingDraft = (email) => {
  try {
    localStorage.removeItem(getDraftKey(email));
  } catch (error) {
    console.error("Failed to clear onboarding draft:", error);
  }
};

export const clearLegacyOnboardingDrafts = () => {
  [
    "brandBasic",
    "audience",
    "goals",
    "voice",
    "content",
    "keywords",
    "challenges",
  ].forEach((key) => localStorage.removeItem(key));
};
