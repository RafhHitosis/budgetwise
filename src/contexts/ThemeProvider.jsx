/* eslint-disable react-refresh/only-export-components */

// src/contexts/ThemeProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the ThemeContext
const ThemeContext = createContext();

// 2. Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 3. The provider component that wraps your app
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode
      ? {
          primary: "#2D1810",
          secondary: "#4A3426",
          accent: "#6B4C35",
          background: "#1A1A1A",
          surface: "#2D2D2D",
          text: "#F8F4E1",
          textSecondary: "#D4C4A8",
          border: "#4A3426",
          borderExpense: "#4A3426",
          cardBg: "#2D2D2D",
          cardHover: "#3D3D3D",
          summaryCard1: "#4A3426",
          summaryCard2: "#6B4C35",
          summaryCard3: "#2D1810",
          buttonPrimary: "#6B4C35",
          buttonSecondary: "#4A3426",
          buttonHover: "#D4C4A8",
          fabBg: "#6B4C35",
          fabHover: "#2D1810",
          overlay: "rgba(0, 0, 0, 0.6)",
        }
      : {
          primary: "#543310",
          secondary: "#74512D",
          accent: "#AF8F6F",
          background: "white",
          surface: "#F8F4E1",
          text: "#543310",
          textSecondary: "#74512D",
          border: "#AF8F6F",
          borderExpense: "#FFE082",
          cardBg: "#F8F4E1",
          cardHover: "#E8DCC0",
          summaryCard1: "#D4C4A8",
          summaryCard2: "#B8906B",
          summaryCard3: "#AF8F6F",
          buttonPrimary: "#AF8F6F",
          buttonSecondary: "#B8906B",
          fabBg: "#AF8F6F",
          fabHover: "#74512D",
          overlay: "rgba(0, 0, 0, 0.3)",
        },
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";
  }, [isDarkMode, theme.colors.background, theme.colors.text]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
