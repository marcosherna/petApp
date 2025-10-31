import React from "react";
import { darkColors, lightColors, ThemeColor } from "../resourses/colors";
import { ThemeContext, ThemeMode } from "../contexts/themeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = React.useState<ThemeMode>("light");
  const [theme, setTheme] = React.useState<ThemeColor>(lightColors);
  const [isDark, setIsDark] = React.useState(false);

  const applyTheme = async (newMode: ThemeMode) => {
    setModeState(newMode);
    const mode = newMode === "dark";

    setIsDark(mode);
    setTheme(mode ? darkColors : lightColors);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
