import React from "react";
import {
  View,
  ViewStyle,
  ViewProps as RNViewProps,
  StyleProp,
  StyleSheet,
} from "react-native";

type AlignVertical = ViewStyle["justifyContent"];
type AlignHorizontal = ViewStyle["alignItems"];
type Direction = ViewStyle["flexDirection"];
type Wrap = ViewStyle["flexWrap"];

interface LayoutProps extends RNViewProps {
  direction?: Direction;
  alignVertical?: AlignVertical;
  alignHorizontal?: AlignHorizontal;
  paddingHorizontal?: number;
  paddingVertical?: number;
  gap?: number;
  wrap?: Wrap;
  fullWidth?: boolean;
  fullHeight?: boolean;
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  spacing?: number; 
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  direction = "column",
  alignVertical = "flex-start",
  alignHorizontal = "flex-start",
  paddingHorizontal,
  paddingVertical,
  gap,
  wrap = "nowrap",
  fullWidth = false,
  fullHeight = false,
  borderRadius,
  backgroundColor,
  borderWidth,
  borderColor,
  spacing,
  style,
  children,
  ...props
}) => {
  const styleLayout: ViewStyle = {
    flexDirection: direction,
    justifyContent: alignVertical,
    alignItems: alignHorizontal,
    flexWrap: wrap,
    ...(gap !== undefined && { gap }),
    ...(paddingHorizontal !== undefined && { paddingHorizontal }),
    ...(paddingVertical !== undefined && { paddingVertical }),
    ...(fullWidth && { width: "100%" }),
    ...(fullHeight && { height: "100%" }),
    ...(borderRadius && { borderRadius }),
    ...(backgroundColor && { backgroundColor }),
    ...(borderWidth && { borderWidth }),
    ...(borderColor && { borderColor }),
    ...(spacing && {
      padding: spacing,
      margin: spacing / 2,
    }),
  };

  return (
    <View style={[styles.base, styleLayout, style]} {...props}>
      {children}
    </View>
  );
};

export default React.memo(Layout);

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
    flexGrow: 0,
  },
});
