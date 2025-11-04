import React from "react";
import { View, StyleSheet } from "react-native";

import { Avatar } from "../../components/ui";
import { IconButton, Label, ToggleThemeButton } from "../../components";

import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";

import { useAuth } from "../../hooks/useAuth";

export default function UserSignIn({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();

  const handleOnSignOut = async () => {
    try {
      await signOut();
      onClose?.();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}>
      <View style={[style.container, style.container_user]}>
        <Avatar
          name={user?.displayName ?? "D. E"}
          size="small"
          online={false}
        />
        <View>
          <Label size="xl">{user?.displayName ?? " "}</Label>
          <Label color="gray">{user?.email ?? " "}</Label>
        </View>
      </View>

      <Label color="gray">Acciones</Label>
      <View style={style.container_buttons}>
        <View style={style.container_buttons_actions}>
          <IconButton
            icon="LogOut"
            variant="ghost"
            onPress={() => handleOnSignOut()}
          />
          <IconButton icon="Settings" variant="ghost" onPress={() => {}} />
          <IconButton icon="MessageSquare" variant="ghost" onPress={() => {}} />
        </View>

        <ToggleThemeButton />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  container_user: {
    alignItems: "center",
    flexDirection: "row",
  },
  container_buttons: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  container_buttons_actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon_explanation: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  icon_info: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9b81f1ff",
    borderRadius: iconography.xl * 1.5,
    width: iconography.lg * 2,
    height: iconography.lg * 2,
  },
});
