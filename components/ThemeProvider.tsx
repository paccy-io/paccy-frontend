"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    // In production, force dark mode only
    if (isProduction) {
      setTheme("dark");
      setMounted(true);
      return;
    }

    // Load theme from localStorage on mount (development only)
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, [isProduction]);

  useEffect(() => {
    // Save theme to localStorage whenever it changes (development only)
    if (mounted && !isProduction) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted, isProduction]);

  const toggleTheme = () => {
    // Prevent theme toggle in production
    if (isProduction) return;
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
