import React, { memo, useCallback } from "react";
import { StyleSheet, StyleProp, ViewStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";

interface CardProps {
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderRadius?: number;
  children: React.ReactNode;
  onPress?: () => void;
  scaleEffect?: boolean;
  pressable?: boolean;
}

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

export const Card = memo(
  ({
    style,
    backgroundColor,
    borderRadius = 14,
    children,
    onPress,
    scaleEffect = true,
    pressable = true,
  }: CardProps) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePress = useCallback(() => {
      if (pressable && onPress) onPress();
    }, [pressable, onPress]);

    const gesture = Gesture.Tap()
      .maxDuration(180)
      .onBegin(() => {
        if (scaleEffect) scale.value = withSpring(0.97, SPRING_CONFIG);
      })
      .onFinalize(() => {
        if (scaleEffect) scale.value = withSpring(1, SPRING_CONFIG);
      })
      .onEnd((_event, success) => {
        if (success && pressable) runOnJS(handlePress)();
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: backgroundColor ?? theme.surface,
              borderRadius,
              shadowColor: theme.surface,
            },
            animatedStyle,
            style,
          ]}
        >
          <View style={styles.inner}>{children}</View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: "stretch",
    marginVertical: 6,
  },
  inner: {
    flex: 1,
  },
});
