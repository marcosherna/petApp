import React from "react";
import { Text, TextProps, TextStyle, PixelRatio } from "react-native";
import {
  FontSizeKey,
  FontWeightKey
} from "../resourses/typography";
import { getTextStyle } from "../helpers/TextStyles";

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
  color = "#000000",
  align = "left",
  paragraph = false,
  numberOfLines,
  style,
  ...rest
}: LabelProps) {
  const textStyle = getTextStyle(size, weight, color, align, paragraph);

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines} {...rest}>
      {children}
    </Text>
  );
}
