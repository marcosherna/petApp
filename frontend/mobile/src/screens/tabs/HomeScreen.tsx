import React from "react";
import { View } from "react-native";

import { Button, IconButton, Label, BottomSheet } from "../../components";
import { UserInfoButtomSheet } from "../../components/partials";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const { isDark, setMode } = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Button title="User" onPress={() => setOpen(true)} />

      <UserInfoButtomSheet show={open} onClose={() => setOpen(false)} />
    </View>
  );
}
