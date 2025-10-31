import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type variantTypes = "primary" | "secondary" | "outline" | "ghost";

interface PressableLayoutProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: variantTypes;
  color?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function PressableLayout({
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  color = "",
  style = {},
  children,
  ...props
}: PressableLayoutProps) {
  const getVariants = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "#F9FAFB",
          borderColor: color,
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: color,
          borderWidth: 1,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      case "primary":
      default:
        return {
          backgroundColor: color,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.layout,
        getVariants(),
        disabled && styles.disabled,
        loading && styles.loading,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  layout: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#D1D5DB",
    borderColor: "#D1D5DB",
    opacity: 0.6,
  },
  loading: {
    opacity: 0.7,
  },
});
