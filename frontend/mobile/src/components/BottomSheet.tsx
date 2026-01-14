import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../hooks/useTheme";

interface BottomSheetProps {
  title?: string;
  visible?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  borderRadius?: number;
}

export function BottomSheet({
  title,
  visible = false,
  onClose,
  children,
  borderRadius = 16,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const translateY = useSharedValue(screenHeight);
  const [isVisible, setIsVisible] = useState(visible);

  const MAX_TRANSLATE = screenHeight * 0.6;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0 && event.translationY < screenHeight) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > MAX_TRANSLATE * 0.35 || event.velocityY > 800;

      if (shouldClose) {
        translateY.value = withTiming(screenHeight, { duration: 220 });
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      cancelAnimation(translateY);
      translateY.value = withTiming(0, { duration: 250 });
    } else {
      translateY.value = withTiming(screenHeight, { duration: 250 });
    }

    return () => cancelAnimation(translateY);
  }, [visible]);

  useAnimatedReaction(
    () => translateY.value,
    (y) => {
      if (y >= screenHeight - 1 && isVisible) {
        runOnJS(setIsVisible)(false);
        if (onClose) runOnJS(onClose)();
      }
    },
    [isVisible]
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderTopLeftRadius: interpolate(
      translateY.value,
      [0, screenHeight],
      [borderRadius, 0],
      Extrapolation.CLAMP
    ),
    borderTopRightRadius: interpolate(
      translateY.value,
      [0, screenHeight],
      [borderRadius, 0],
      Extrapolation.CLAMP
    ),
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, screenHeight],
      [0.6, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: "rgba(0,0,0,1)" },
          backdropStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.surface,
              shadowColor: "black",
            },
            sheetStyle,
          ]}
        >
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: theme.secondaryText },
            ]}
          />
          {title ? (
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ maxHeight: MAX_TRANSLATE - 40 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    elevation: 20,
    zIndex: 20,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dragIndicator: {
    width: 50,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
});
