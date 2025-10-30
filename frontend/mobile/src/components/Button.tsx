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

type variantTypes = "primary" | "secondary" | "outline";
const variants = {
  primary: {
    backgroundColor: "#10B981",
  },
  secondary: {
    backgroundColor: "#F9FAFB",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#10B981",
    borderWidth: 1,
  },
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: variantTypes;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}



export function Button({
  title = "Button",
  onPress,
  disabled = false,
  loading = false,
  variant = "primary", // 'primary', 'secondary', or 'outline'
  style = {},
  textStyle = {},
  ...props
}: ButtonProps) {
  const getButtonStyles = () => {
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

  const getTextStyles = () => {
    switch (variant) {
      case "secondary":
        return { color: "#10B981" };
      case "outline":
        return { color: "#10B981" };
      case "primary":
      default:
        return { color: "#FFFFFF" };
    }
  };

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
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
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
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
