import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const THEME_STORAGE_KEY = "siteTheme";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getStoredTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return getSystemTheme();
};

const applyThemeClass = (theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

if (typeof document !== "undefined") {
  applyThemeClass(getStoredTheme());
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStoredTheme());

  useLayoutEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (value) => {
    setThemeState(typeof value === "function" ? value(theme) : value);
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme: () =>
        setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const useTheme = () => useContext(ThemeContext);

export { THEME_STORAGE_KEY, ThemeProvider, useTheme };
