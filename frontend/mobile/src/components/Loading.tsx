import React from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../resourses/spacing";
import { fontSizes, fontWeights, lineHeights } from "../resourses/typography";

interface LoadingProps {
  visible: boolean;
  text?: string;
  backgroundColor?: string;
  spinnerColor?: string;
  spinnerSize?: "small" | "large" | number;
  opacity?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Loading({
  visible,
  text = "Cargando...",
  backgroundColor,
  spinnerColor,
  spinnerSize = "large",
  opacity = 0.4,
  disabled = true,
  style,
}: LoadingProps) {
  const { theme, isDark } = useTheme();

  const effectiveBackground =
    backgroundColor ??
    (isDark ? "rgba(30,41,59,0.85)" : "rgba(255,255,255,0.75)");
  const effectiveSpinnerColor = spinnerColor ?? theme.primary;

  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    if (visible)
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });
    else
      scale.value = withTiming(0.9, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => !disabled && console.log("Overlay pressed")}
      >
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(0,0,0,${opacity})` },
          ]}
        >
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(150)}
            style={[
              styles.container,
              animatedStyle,
              {
                backgroundColor: effectiveBackground,
                borderColor: isDark ? "#334155" : "rgba(255,255,255,0.3)",
                shadowColor: isDark ? "#000" : "#111827",
              },
              style,
            ]}
          >
            <ActivityIndicator
              size={spinnerSize}
              color={effectiveSpinnerColor}
            />
            {text ? (
              <Text
                style={[
                  styles.text,
                  {
                    color: theme.text,
                    fontSize: fontSizes.md,
                    lineHeight: lineHeights.md,
                    fontWeight: fontWeights.medium,
                  },
                ]}
              >
                {text}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    textAlign: "center",
    opacity: 0.9,
  },
});
