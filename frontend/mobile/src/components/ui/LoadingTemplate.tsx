import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Label } from "../Label";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";

interface LoadingTemplateProps {
  message?: string;
}

const LoadingTemplateComponent: React.FC<LoadingTemplateProps> = ({
  message = "Cargando...",
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Label color="gray">{message}</Label>
    </View>
  );
};

export const LoadingTemplate = React.memo(LoadingTemplateComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
});
