"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ThemeContextProps {
  theme: "light" | "dark" | "system";
  handleTheme: (type: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const handleTheme = (type: string | "light" | "dark" | "system") => {
    switch (type) {
      case "dark":
        setTheme("dark");
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        break;
      case "light":
        setTheme("light");
        localStorage.setItem("theme", "light");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        break;
      default:
        setTheme("system");
        localStorage.setItem("theme", "system");
        applySystemTheme();
        break;
    }
  };

  const applySystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const _theme = localStorage.getItem("theme");
    handleTheme(_theme ?? "system");

    if (_theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applySystemTheme);

      return () => {
        mediaQuery.removeEventListener("change", applySystemTheme);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    theme,
    handleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
