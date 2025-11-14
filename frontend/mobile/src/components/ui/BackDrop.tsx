import React from "react";
import { Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

const { height } = Dimensions.get("screen");

interface Props {
  topAnimation: SharedValue<number>;
  backDropColor?: string;
  closeHeight: number;
  openHeight: number;
  close: () => void;
  visible?: boolean;
}

export const BackDrop = ({
  topAnimation,
  backDropColor = "black",
  closeHeight,
  openHeight,
  close,
  visible = false,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      topAnimation.value,
      [openHeight, closeHeight],
      [0.5, 0]
    );
    return {
      opacity: withTiming(opacity, { duration: 50 }),
    };
  });

  if (!visible) return;

  return (
    <Pressable onPress={close} style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: backDropColor },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
};
