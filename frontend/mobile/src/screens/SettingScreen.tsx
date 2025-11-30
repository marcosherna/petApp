import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FileText, Info, LogOut, Trash2, KeyRound } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { spacing } from "../resourses/spacing";

import {
  Avatar,
  Card,
  Divider,
  Layout,
  Loading,
  Shape,
} from "../components/ui";
import { Button, Input, Label, ItemSetting } from "../components";

import { iconography } from "../resourses/iconography";
import { RootStackNavigation } from "../navigations/params";
import {
  getUserData,
  reauthenticateUser,
  updateUserProfile,
} from "../network/services/authService";
import { AboutComponent } from "./partials/AboutComponent";
import { TermAndConditionsComponent } from "./partials/TermAndConditionsComponent";
import { AlertDeleteSessionComponent } from "./partials/AlertDeleteSessionComponent";
import { ChangePasswordComponent } from "./partials/ChangePasswordComponent";

import { useTheme } from "../hooks/useTheme";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { deleteUser } from "firebase/auth";

type OptionBttSheet =
  | "about"
  | "terms"
  | "alertDeleteSession"
  | "changePassword";

export default function SettingScreen() {
  const bttSheet = useRef<BottomSheetModal>(null);
  const [option, setOption] = useState<OptionBttSheet>("about");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<RootStackNavigation>();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { theme, isDark } = useTheme();

  const { values, errors, handleChange, validateForm, setValues } = useForm({
    initialValues: {
      displayName: user?.displayName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
    validations: {
      displayName: (value) => {
        if (!value) return "El nombre no puede estar vacío";
        if (value.length < 3) return "Debe tener al menos 3 caracteres";
        return null;
      },
      phoneNumber: (value) => {
        if (!value) return null;
        if (!/^[0-9]{8,15}$/.test(value)) return "Número inválido";
        return null;
      },
    },
  });

  const handleOpenBttSheet = (option: OptionBttSheet) => {
    setOption(option);
    bttSheet.current?.present();
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      if (!user) return;
      setLoading(true);
      
      await reauthenticateUser(user, password);
      await deleteUser(user);
      bttSheet.current?.dismiss();

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = useMemo(() => {
    if (option === "about") return <AboutComponent />;
    if (option === "terms") return <TermAndConditionsComponent />;
    if (option === "alertDeleteSession")
      return (
        <AlertDeleteSessionComponent
          onCancel={() => bttSheet.current?.dismiss()}
          onConfirm={(password) => handleDeleteAccount(password)}
        />
      );
    if (option === "changePassword")
      return (
        <ChangePasswordComponent onClose={() => bttSheet.current?.dismiss()} />
      );
  }, [option]);

  const handleLogout = async () => {
    try {
      await signOut();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  const updateUserData = async () => {
    const formIsValid = validateForm();
    if (!formIsValid) return;

    try {
      const currentUser = user;
      if (!currentUser) return;
      setLoading(true);

      await updateUserProfile(
        currentUser,
        values.displayName,
        values.phoneNumber
      );

      Alert.alert("Éxito", "Información actualizada");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await getUserData(user.uid);
      setValues((prev) => ({
        ...prev,
        phoneNumber: data?.phoneNumber ?? "",
      }));
    })();
  }, [user]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.md,
      }}
    >
      <ScrollView style={{ flex: 1, padding:  spacing.md, marginTop: 0 }}>
        <Card pressable={false}>
          <Layout
            direction="row"
            gap={spacing.md}
            alignHorizontal="center"
            paddingHorizontal={spacing.md}
            paddingVertical={spacing.md}
          >
            <Avatar
              name={user?.displayName ?? "User"}
              source={{ uri: user?.photoURL ?? "" }}
              size={iconography.xl}
              online
            />
            <Layout gap={spacing.xs}>
              <Label size="lg" weight="semibold" numberOfLines={1}>
                {user?.displayName}
              </Label>
              <Label numberOfLines={1}>{user?.email}</Label>
            </Layout>
          </Layout>
        </Card>

        <Layout marginTop={spacing.lg} gap={spacing.sm}>
          <Label color="gray" weight="semibold">
            Información Personal
          </Label>

          <Card pressable={false}>
            <Layout paddingHorizontal={spacing.md} paddingVertical={spacing.md}>
              <Input
                label="Nombre"
                value={values.displayName}
                onChangeText={(text) => handleChange("displayName", text)}
                error={errors.displayName}
              />
              <Divider margin={spacing.xs} />
              <Input
                label="Teléfono"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
                error={errors.phoneNumber}
              />
              <Divider margin={spacing.md} />

              <ItemSetting onPress={() => handleOpenBttSheet("changePassword")}>
                <Shape
                  variant="contained"
                  shape="rounded"
                  size={iconography.sm}
                >
                  <KeyRound color="#fff" size={iconography.sm} />
                </Shape>

                <Label size="lg">Cambiar Contrasenia</Label>
              </ItemSetting>
            </Layout>
          </Card>
        </Layout>

        <Layout marginTop={spacing.lg} gap={spacing.sm}>
          <Label color="gray" weight="semibold">
            Soporte
          </Label>

          <Card pressable={false}>
            <Layout paddingHorizontal={spacing.md} paddingVertical={spacing.md}>
              <ItemSetting onPress={() => handleOpenBttSheet("about")}>
                <Shape variant="ghost" shape="circle" size={iconography.sm}>
                  <Info color={theme.secondaryText} size={iconography.sm} />
                </Shape>

                <Label size="lg">About</Label>
              </ItemSetting>

              <Divider margin={spacing.md} />

              <ItemSetting onPress={() => handleOpenBttSheet("terms")}>
                <Shape variant="ghost" shape="circle" size={iconography.sm}>
                  <FileText color={theme.secondaryText} size={iconography.sm} />
                </Shape>

                <Label size="lg">Terminos y condiciones</Label>
              </ItemSetting>
            </Layout>
          </Card>
        </Layout>

        <Layout marginTop={spacing.lg} gap={spacing.sm}>
          <Label color="gray" weight="semibold">
            Cuenta
          </Label>

          <Card pressable={false}>
            <Layout paddingHorizontal={spacing.md} paddingVertical={spacing.md}>
              <ItemSetting onPress={() => handleLogout()}>
                <Shape variant="ghost" shape="circle" size={iconography.sm}>
                  <LogOut color={theme.secondaryText} size={iconography.sm} />
                </Shape>

                <Label size="lg">Cerrar Sesion</Label>
              </ItemSetting>

              <Divider margin={spacing.md} />

              <ItemSetting
                onPress={() => handleOpenBttSheet("alertDeleteSession")}
              >
                <Shape variant="ghost" shape="circle" size={iconography.sm}>
                  <Trash2 color={theme.secondaryText} size={iconography.sm} />
                </Shape>

                <Label size="lg">Eliminar cuenta</Label>
              </ItemSetting>
            </Layout>
          </Card>

          <Layout marginTop={spacing.lg} gap={spacing.sm} fullWidth>
            <Button
              title="Guardar"
              onPress={() => updateUserData()}
              variant="outline"
              style={{ width: "100%" }}
            />
          </Layout>
        </Layout>
      </ScrollView>

      <BottomSheetModal
        ref={bttSheet}
        index={0}
        snapPoints={["25%"]}
        backgroundStyle={{
          backgroundColor: isDark ? theme.surface : theme.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? theme.outline : theme.secondaryText,
          width: 40,
        }}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
        }}
      >
        <BottomSheetScrollView>{renderContent}</BottomSheetScrollView>
      </BottomSheetModal>

      <Loading visible={loading} />
    </SafeAreaView>
  );
}
