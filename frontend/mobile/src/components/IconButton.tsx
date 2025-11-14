import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import * as Lucide from "lucide-react-native";
import { useTheme } from "../hooks/useTheme"; // 👈 Importamos el tema

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
  fillColor?: string
}

export function IconButton({
  icon = "Plus",
  size = 24,
  color,
  colorShape,
  onPress,
  disabled = false,
  variant = "default",
  shape = "rounded",
  style,
  fillColor, 
  ...props
}: IconButtonProps) {
  const { theme } = useTheme(); 

  const IconComponent = Lucide[icon] as React.ComponentType<{
    size?: number;
    color?: string;
    fill?: string
  }>;

  if (!IconComponent) return null;
 
  const colors = {
    icon: color || (variant === "contained" ? theme.onPrimary : theme.primary),
    shape: colorShape || theme.primary,
    disabled: theme.outline,
  };

  const getButtonStyles = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case "outline":
        return {
          borderWidth: 1,
          borderColor: colors.shape,
          backgroundColor: "transparent",
        };
      case "contained":
        return {
          backgroundColor: colors.shape,
        };
      case "ghost":
        return {
          backgroundColor: `${colors.shape}33`, 
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
          borderRadius: size * 1.5,
          width: size * 2,
          height: size * 2,
        }
      : {
          borderRadius: 8,
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
      <IconComponent
        size={size}
        color={disabled ? colors.disabled : colors.icon}
        {...(fillColor ? { fill: fillColor } : undefined)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
});
