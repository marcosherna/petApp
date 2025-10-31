import React from "react";
import { ThemeColor, lightColors } from "../resourses/colors";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: ThemeColor;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: lightColors,
  mode: "system",
  setMode: () => {},
});
