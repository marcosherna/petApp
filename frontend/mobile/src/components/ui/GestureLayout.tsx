import React from "react";
import { StyleSheet, ViewStyle, StyleProp, View } from "react-native";
import * as Lucide from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { RectButton } from "react-native-gesture-handler";

type Variant = "default" | "outline" | "contained" | "ghost";
type Shape = "rounded" | "circle";

interface GestureLayoutProps {
  size?: number;
  color?: string;
  colorShape?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  shape?: Shape;
  style?: StyleProp<ViewStyle>;
  fillColor?: string;
  children?: React.ReactNode;
}

export function GestureLayout({
  size = 24,
  color,
  colorShape,
  onPress,
  disabled = false,
  variant = "default",
  shape = "rounded",
  style,
  fillColor,
  children,
  ...props
}: GestureLayoutProps) {
  const { theme } = useTheme();

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
    <RectButton
      style={[
        styles.button,
        getShapeStyles(),
        getButtonStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      enabled={!disabled}
      rippleColor={"rgba(0,0,0,0.1)"}
      {...props}
    >
      {children}
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});
