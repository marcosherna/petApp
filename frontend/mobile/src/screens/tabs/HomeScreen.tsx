import React from "react";
import { View } from "react-native";

import { Button, IconButton, Label, BottomSheet } from "../../components";
import { UserInfoButtomSheet } from "../../components/partials";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { isDark, setMode } = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);
  const { user } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Label> {user ? user.displayName : "Not user"}</Label>

      <Button title="User" onPress={() => setOpen(true)} />

      <UserInfoButtomSheet show={open} onClose={() => setOpen(false)} />
    </View>
  );
}
