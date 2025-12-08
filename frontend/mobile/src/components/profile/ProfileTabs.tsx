import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "../../components";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";

interface Props {
  active: "myProducts" | "favorites";
  onChange: (tab: "myProducts" | "favorites") => void;
}

export function ProfileTabs({ active, onChange }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon="PlusSquare"
        variant={active === "myProducts" ? "ghost" : "outline"}
        color={theme.primary}
        colorShape={theme.primary}
        onPress={() => onChange("myProducts")}
      />

      <IconButton
        icon="Heart"
        variant={active === "favorites" ? "ghost" : "outline"}
        color={theme.primary}
        colorShape={theme.primary}
        onPress={() => onChange("favorites")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
});
