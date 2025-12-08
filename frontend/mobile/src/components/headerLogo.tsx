import { PawPrint } from "lucide-react-native";
import { View, StyleSheet, Image } from "react-native";

import { iconography } from "../resourses/iconography";
import { spacing } from "../resourses/spacing";

import { Label } from "./Label";

import { useTheme } from "../hooks/useTheme";

export const HeaderLogo = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
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
  logo: {
    width: 110,
    height: 110,
    marginLeft: -20,
  },
});
