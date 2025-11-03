import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle } from "react-native";

import { fontWeights } from "../../resourses/typography";
import { spacing } from "../../resourses/spacing";

import { useTheme } from "../../hooks/useTheme";

type AvatarSize = "small" | "medium" | "large" | number;

interface AvatarProps {
  name?: string;
  source?: { uri: string } | number;
  size?: AvatarSize;
  borderWidth?: number;
  borderColor?: string;
  showOnline?: boolean;
  online?: boolean;
  style?: ViewStyle;
  textStyle?: object;
}

const getSize = (size: AvatarSize): number => {
  if (typeof size === "number") return size;
  switch (size) {
    case "small":
      return 40;
    case "medium":
      return 60;
    case "large":
      return 100;
    default:
      return 60;
  }
};

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "000000".substring(0, 6 - color.length) + color;
};

const getInitials = (name: string): string => {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function Avatar({
  name = "",
  source,
  size = "medium",
  borderWidth = 0,
  borderColor,
  showOnline = false,
  online = false,
  style,
  textStyle,
}: AvatarProps) {
  const { theme } = useTheme();

  const avatarSize = getSize(size);
  const hasImage = source && (typeof source === "number" || source.uri);
  const initials = name ? getInitials(name) : "?";
  const backgroundColor = name ? stringToColor(name) : theme.outline;

  const effectiveBorderColor = borderColor ?? theme.background;
  const fontSize = avatarSize * 0.4;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: hasImage ? "transparent" : backgroundColor,
            borderWidth,
            borderColor: effectiveBorderColor,
          },
        ]}
      >
        {hasImage ? (
          <Image source={source} style={styles.image} resizeMode="cover" />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize,
                color: theme.onPrimary,
                fontWeight: fontWeights.semibold,
              },
              textStyle,
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: avatarSize * 0.25,
              height: avatarSize * 0.25,
              borderRadius: avatarSize * 0.125,
              backgroundColor: online ? theme.accent : theme.secondaryText,
              borderColor: theme.surface,
              right: avatarSize * 0.05,
              bottom: avatarSize * 0.05,
            },
          ]}
        >
          {online && (
            <View
              style={[styles.onlineDot, { backgroundColor: theme.surface }]}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: spacing.xs,
  },
  avatar: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    textAlign: "center",
  },
  onlineIndicator: {
    position: "absolute",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineDot: {
    width: "50%",
    height: "50%",
    borderRadius: 999,
  },
});
