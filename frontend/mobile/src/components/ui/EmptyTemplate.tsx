import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Package, Search, AlertCircle } from "lucide-react-native";

import { useTheme } from "../../hooks/useTheme";
import { fontSizes, fontWeights } from "../../resourses/typography";

interface EmptyTemplateProps {
  message?: string;
  subMessage?: string;
  icon?: "package" | "search" | "alert" | React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
}

const EmptyTemplate: React.FC<EmptyTemplateProps> = ({
  message = "No hay elementos disponibles",
  subMessage = "Intenta buscar de nuevo o agrega algo nuevo",
  icon = "package",
  backgroundColor,
  textColor,
  padding = 32,
}) => {
  const { theme } = useTheme();

  const renderIcon = useMemo(() => {
    if (React.isValidElement(icon)) return icon;

    const color = theme.secondaryText;
    const size = 64;

    switch (icon) {
      case "package":
        return <Package size={size} color={color} strokeWidth={1.5} />;
      case "search":
        return <Search size={size} color={color} strokeWidth={1.5} />;
      case "alert":
        return <AlertCircle size={size} color={color} strokeWidth={1.5} />;
      default:
        return <Package size={size} color={color} strokeWidth={1.5} />;
    }
  }, [icon, theme]);

  return (
    <Animated.View
      entering={FadeIn.duration(300).springify()}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? theme.background,
          padding,
        },
      ]}
    >
      <View style={styles.iconContainer}>{renderIcon}</View>

      <Text
        style={[
          styles.message,
          {
            color: textColor ?? theme.text,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.semibold,
          },
        ]}
      >
        {message}
      </Text>

      {subMessage ? (
        <Text
          style={[
            styles.subMessage,
            {
              color: textColor ?? theme.secondaryText,
              fontSize: fontSizes.md,
            },
          ]}
        >
          {subMessage}
        </Text>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    opacity: 0.8,
  },
  message: {
    textAlign: "center",
    marginBottom: 6,
  },
  subMessage: {
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 280,
  },
});

export default memo(EmptyTemplate);
