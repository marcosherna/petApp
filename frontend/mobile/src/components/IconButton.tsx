import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import * as Lucide from "lucide-react-native";

type LucideIconName = keyof typeof Lucide;
type Variant = "default" | "outline" | "contained" | "ghost";
type Shape = "rounded" | "circle";

interface IconButtonProps {
  icon?: LucideIconName;
  size?: number;
  color?: string;
  colorShape?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  shape?: Shape;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon = "Plus",
  size = 24,
  color = "#10B981",
  colorShape,
  onPress,
  disabled = false,
  variant = "default",
  shape = "rounded",
  style,
  ...props
}: IconButtonProps) {
  const IconComponent = Lucide[icon] as React.ComponentType<{
    size?: number;
    color?: string;
  }>;

  if (!IconComponent) {
    return null;
  }

  // Determine background/border color based on variant
  const getShapeColor = (): string => {
    if (colorShape) return colorShape;
    if (variant === "ghost") {
      // Add transparency for ghost variant
      return `${color}33`; // 20% opacity (33 in hex)
    }
    return color; // Default to icon color
  };

  const getButtonStyles = (): StyleProp<ViewStyle> => {
    const shapeColor = getShapeColor();

    switch (variant) {
      case "outline":
        return {
          borderWidth: 1,
          borderColor: shapeColor,
          backgroundColor: "transparent",
        };
      case "contained":
        return {
          backgroundColor: shapeColor,
        };
      case "ghost":
        return {
          backgroundColor: shapeColor, // Transparent version of color
        };
      case "default":
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getShapeStyles = (): StyleProp<ViewStyle> => {
    return shape === "circle"
      ? {
          borderRadius: size * 1.5, // Ensures circular shape
          width: size * 2,
          height: size * 2,
        }
      : {
          borderRadius: 8, // Default rounded square
          padding: 8,
        };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getShapeStyles(),
        getButtonStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <IconComponent size={size} color={disabled ? "#D1D5DB" : color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});