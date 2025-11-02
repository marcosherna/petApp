import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, LogIn, UserPlus } from "lucide-react-native";

import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";

import { BottomSheet } from "../BottomSheet";
import { Label } from "../Label";
import { IconButton } from "../IconButton";
import { ToggleThemeButton } from "../ToggleThemeButton";
import { Avatar } from "../Avatar";

import { useTheme } from "../../hooks/useTheme";
import { RootStackNavigation } from "../../navigations/params";
import { useAuth } from "../../hooks/useAuth";

const UserNotLogin = ({ onClose }: { onClose?: () => void }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();

  const handleNavigation = (screen: any) => {
    onClose?.();
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={style.container}>
        <View
          style={[style.icon_info, { backgroundColor: `${theme.accent}33` }]}
        >
          <Activity size={iconography.lg} color={theme.accent} />
        </View>

        <Label size="4xl">¡Oops!</Label>
        <Label align="center" color="gray" paragraph>
          Parece que aún no has iniciado sesión. Para acceder a tu cuenta,
          gestionar tus datos o realizar acciones personalizadas, por favor
          inicia sesión o crea una nueva cuenta.
        </Label>

        <View style={style.icon_explanation}>
          <Label align="center" color="gray">
            Puedes iniciar sesión presionando{" "}
          </Label>

          <LogIn size={18} color="#666" />

          <Label align="center" color="gray">
            {" "}
            o registrarte tocando{" "}
          </Label>

          <UserPlus size={18} color="#666" />
        </View>
      </View>

      <View style={style.container_buttons}>
        <View style={style.container_buttons_actions}>
          <IconButton
            icon="LogIn"
            variant="ghost"
            onPress={() => handleNavigation("authLogin")}
          />

          <IconButton
            icon="UserPlus"
            variant="ghost"
            onPress={() => handleNavigation("authRegister")}
          />
        </View>

        <ToggleThemeButton />
      </View>
    </>
  );
};

const UserLogin = ({ onClose }: { onClose?: () => void }) => {
  const { user, signOut } = useAuth();

  const handleOnSignIn = async () => {
    try {
      await signOut();
      onClose?.();
    } catch (error) {
      // TODO: implement toast
      console.log(error);
    }
  };

  return (
    <>
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
            onPress={() => handleOnSignIn()}
          />
          <IconButton icon="Settings" variant="ghost" onPress={() => {}} />
          <IconButton icon="MessageSquare" variant="ghost" onPress={() => {}} />
        </View>

        <ToggleThemeButton />
      </View>
    </>
  );
};

interface UserInfoBottomSheetProps {
  show?: boolean;
  onClose?: () => void;
}

export function UserInfoBottomSheet({
  show = false,
  onClose,
}: UserInfoBottomSheetProps) {
  const { user } = useAuth();

  return (
    <BottomSheet visible={show} onClose={onClose}>
      {user ? (
        <UserLogin onClose={onClose} />
      ) : (
        <UserNotLogin onClose={onClose} />
      )}
    </BottomSheet>
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
