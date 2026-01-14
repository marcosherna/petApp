import { useTheme } from "../hooks/useTheme";
import { IconButton } from "./IconButton";

export function ToggleThemeButton() {
  const { isDark, setMode } = useTheme();

  return (
    <IconButton
      icon={isDark ? "Sun" : "Moon"}
      variant="ghost"
      color={isDark ? "#FFDE59" : "#CC6CE7"}
      colorShape={isDark ? "#FFDE59" : "#CC6CE7"}
      onPress={() => setMode(isDark ? "light" : "dark")}
    />
  );
}
