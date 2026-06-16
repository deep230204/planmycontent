const GENERATED_RESULTS_KEY = "latestGeneratedResults";
const MORE_RESULTS_KEY = "latestMoreGeneratedResults";
const REFINED_RESULTS_KEY = "latestRefinedResult";
const RESULT_STORAGE_VERSION = 2;

const parseStoredValue = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
};

const normalizeIdeasPayload = (value) => {
  if (Array.isArray(value)) {
    return { ideas: value };
  }

  if (value && Array.isArray(value.ideas)) {
    return value;
  }

  return null;
};

const readIdeasPayload = (key) => {
  const stored = parseStoredValue(key);

  if (
    stored &&
    stored.version === RESULT_STORAGE_VERSION &&
    Array.isArray(stored.ideas)
  ) {
    return stored;
  }

  return null;
};

const writeIdeasPayload = (key, payload) => {
  const normalized = normalizeIdeasPayload(payload);
  if (!normalized) return;

  localStorage.setItem(
    key,
    JSON.stringify({
      ...normalized,
      version: RESULT_STORAGE_VERSION,
      savedAt: new Date().toISOString(),
    })
  );
};

export {
  GENERATED_RESULTS_KEY,
  MORE_RESULTS_KEY,
  REFINED_RESULTS_KEY,
  RESULT_STORAGE_VERSION,
  normalizeIdeasPayload,
  readIdeasPayload,
  writeIdeasPayload,
};
