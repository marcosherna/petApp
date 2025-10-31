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

type variantTypes = "primary" | "secondary" | "outline";
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: variantTypes;
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
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "#F9FAFB",
          borderColor: "#10B981",
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: "#10B981",
          borderWidth: 1,
        };
      case "primary":
      default:
        return {
          backgroundColor: "#10B981",
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return "#9CA3AF";
    switch (variant) {
      case "secondary":
      case "outline":
        return "#10B981";
      case "primary":
      default:
        return "#FFFFFF";
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
        loading && styles.loading,
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
          color={variant === "primary" ? "#FFFFFF" : "#10B981"}
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
    borderWidth: 0,
  },
  disabled: {
    backgroundColor: "#D1D5DB",
    borderColor: "#D1D5DB",
  },
  loading: {
    opacity: 0.7,
  },
});
