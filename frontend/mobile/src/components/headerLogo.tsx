import { PawPrint } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

import { iconography } from "../resourses/iconography";
import { spacing } from "../resourses/spacing";

import { Label } from "./Label";

import { useTheme } from "../hooks/useTheme";

export const HeaderLogo = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <PawPrint color={theme.primary} size={iconography.md} />
      <Label weight="bold">PetApp</Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
});
