import { PixelRatio } from "react-native";
import {
  FontSizeKey,
  fontSizes,
  FontWeightKey,
  fontWeights,
  lineHeights,
} from "../resourses/typography";

export const getTextStyle = (
  size: FontSizeKey = "md",
  weight: FontWeightKey = "normal",
  color = "#000000",
  align: "left" | "center" | "right" | "justify" = "left",
  paragraph = false
) => {
  const baseSize = fontSizes[size];
  return {
    fontSize: PixelRatio.roundToNearestPixel(baseSize),
    fontWeight: fontWeights[weight],
    color,
    textAlign: align,
    lineHeight: paragraph
      ? PixelRatio.roundToNearestPixel(lineHeights[size])
      : undefined,
  } as const;
};
