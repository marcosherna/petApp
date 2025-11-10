import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, LogIn, UserPlus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackNavigation } from "../../navigations/params";

import { IconButton, Label, ToggleThemeButton } from "../../components";

import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";

import { useTheme } from "../../hooks/useTheme";

interface UserNotSigInProps {
  onClose?: () => void;
}

export default function UserNotSigIn({ onClose }: UserNotSigInProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();

  const insets = useSafeAreaInsets();

  const handleNavigation = (screen: any) => {
    onClose?.();
    navigation.navigate(screen);
  };

  return (
    <View
      style={[
        style.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
    >
      <View style={style.container_info}>
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
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },

  container_info: {
    alignItems: "center",
    gap: spacing.md,
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
