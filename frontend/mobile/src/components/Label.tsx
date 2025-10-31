import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

import { getTextStyle } from "../helpers/TextStyles";
import { FontSizeKey, FontWeightKey } from "../resourses/typography";

import { useTheme } from "../hooks/useTheme";  
interface LabelProps extends Omit<TextProps, "style"> {
  children: React.ReactNode;
  size?: FontSizeKey;
  weight?: FontWeightKey;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  paragraph?: boolean;
  numberOfLines?: number;
  style?: TextStyle;
}

export function Label({
  children,
  size = "md",
  weight = "normal",
  color,
  align = "left",
  paragraph = false,
  numberOfLines,
  style,
  ...rest
}: LabelProps) { 
  const { theme } = useTheme();
 
  const resolvedColor = color ?? theme.text;

  const textStyle = getTextStyle(size, weight, resolvedColor, align, paragraph);

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines} {...rest}>
      {children}
    </Text>
  );
}
