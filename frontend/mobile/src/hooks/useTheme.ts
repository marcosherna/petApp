import React from "react";
import { ThemeContext } from "../contexts/themeContext";

export const useTheme = () => React.useContext(ThemeContext);
