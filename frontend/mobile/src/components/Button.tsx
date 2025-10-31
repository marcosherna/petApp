import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { FontSizeKey, FontWeightKey } from "../resourses/typography";
import { getTextStyle } from "../helpers/TextStyles";
import { useTheme } from "../hooks/useTheme";

type VariantType = "primary" | "secondary" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: VariantType;
  textSize?: FontSizeKey;
  textWeight?: FontWeightKey;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title = "Button",
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  textSize = "md",
  textWeight = "semibold",
  style = {},
  textStyle = {},
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyles = (): ViewStyle => {
    if (disabled) {
      return {
        backgroundColor: theme.outline,
        borderColor: theme.outline,
      };
    }

    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.surface,
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case "primary":
      default:
        return {
          backgroundColor: theme.primary,
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.secondaryText;

    switch (variant) {
      case "secondary":
      case "outline":
        return theme.primary;
      case "primary":
      default:
        return theme.onPrimary;
    }
  };

  const baseTextStyle = getTextStyle(
    textSize,
    textWeight,
    getTextColor(),
    "center"
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? theme.onPrimary : theme.primary}
        />
      ) : (
        <Text style={[baseTextStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  disabled: {
    opacity: 0.7,
  },
});
