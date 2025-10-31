import React from "react";
import { darkColors, lightColors, ThemeColor } from "../resourses/colors";
import { ThemeContext, ThemeMode } from "../contexts/themeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = React.useState<ThemeMode>("light");
  const [theme, setTheme] = React.useState<ThemeColor>(lightColors);

  const applyTheme = async (newMode: ThemeMode) => {
    setModeState(newMode);
    const isDark = newMode === "dark";

    setTheme(isDark ? darkColors : lightColors);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
