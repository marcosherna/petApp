import React from "react";
import { IconButton } from "./IconButton";
import { useTheme } from "../hooks/useTheme";

export function AIBrainButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <IconButton
      icon="Sparkles"
      size={22}
      color={theme.primary}
      colorShape="transparent"
      variant="ghost"
      onPress={onPress}
      style={{ marginRight: 6 }}
    />
  );
}
