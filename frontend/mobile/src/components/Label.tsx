import React from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";

type LabelSize = "sm" | "md" | "lg" | "xl" | "2xl";
type LabelWeight =
  | "100"
  | "200"
  | "300"
  | "normal"
  | "500"
  | "600"
  | "bold"
  | "800"
  | "900";
type LabelAlign = "left" | "center" | "right" | "justify";

interface LabelProps extends Omit<TextProps, "style"> {
  children: React.ReactNode;
  size?: LabelSize;
  weight?: LabelWeight;
  color?: string;
  align?: LabelAlign;
  paragraph?: boolean;
  numberOfLines?: number;
  style?: TextStyle;
}

const sizes: Record<LabelSize, number> = {
  sm: 12,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
};

export function Label({
  children,
  size = "md",
  weight = "normal",
  color = "#000000",
  align = "left",
  paragraph = false,
  numberOfLines,
  style,
  ...rest
}: LabelProps) {
  const textStyle = {
    fontSize: sizes[size],
    fontWeight: weight,
    color,
    textAlign: align,
    lineHeight: paragraph ? sizes[size] * 1.5 : undefined,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines} {...rest}>
      {children}
    </Text>
  );
}
