import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  AlertTriangle,
  ChevronRight,
  Code2,
  FileText,
  Github,
  Globe,
  Info,
  LogOut,
  Rocket,
  ShieldCheck,
  Smartphone,
  Trash2,
  Lock,
  ShieldAlert,
} from "lucide-react-native";
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
  GestureIconButton,
  Layout,
  Loading,
  Shape,
} from "../components/ui";
import { Button, Input, Label } from "../components";

import { iconography } from "../resourses/iconography";
import { RootStackNavigation } from "../navigations/params";
import {
  getUserData,
  updateUserProfile,
} from "../network/services/authService";

import { useTheme } from "../hooks/useTheme";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { type UserInfo } from "../network/models/User";

const ItemSetting = ({
  children,
  onPress,
}: {
  children?: React.ReactNode;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Layout
        direction="row"
        alignHorizontal="center"
        alignVertical="space-between"
        fullWidth
      >
        <Layout
          direction="row"
          gap={spacing.md}
          alignHorizontal="center"
          alignVertical="center"
        >
          {children}
        </Layout>

        <ChevronRight color={theme.secondaryText} />
      </Layout>
    </TouchableOpacity>
  );
};

const AboutComponent = () => {
  const { theme } = useTheme();

  return (
    <Layout
      paddingHorizontal={spacing.md}
      paddingVertical={spacing.md}
      gap={spacing.md}
    >
      <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
        <Info size={iconography.md} color={theme.secondaryText} />
        <Label size="lg" weight="bold">
          Acerca de esta aplicación
        </Label>
      </Layout>

      <Label paragraph>
        Esta aplicación fue creada para ofrecer una experiencia rápida, moderna
        y segura. Nuestro objetivo es que puedas gestionar tu cuenta, tus
        preferencias y el acceso a nuestros servicios de la forma más simple
        posible.
      </Label>

      <Divider margin={spacing.md} />

      {/* Características */}
      <Layout gap={spacing.sm}>
        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <Rocket color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">Rendimiento optimizado</Label>
        </Layout>
        <Label paragraph>
          Construida con tecnologías modernas para brindar transiciones fluidas
          y un tiempo de respuesta rápido.
        </Label>

        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <ShieldCheck color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">Seguridad primero</Label>
        </Layout>
        <Label paragraph>
          Tu información se maneja con estrictos estándares de seguridad,
          garantizando privacidad y protección.
        </Label>

        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <Smartphone color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">Diseño responsivo</Label>
        </Layout>
        <Label paragraph>
          Adaptado para verse perfectamente en cualquier dispositivo móvil.
        </Label>
      </Layout>

      <Divider margin={spacing.md} />

      {/* Información técnica */}
      <Label size="lg" weight="semibold">
        Información técnica
      </Label>

      <Layout gap={spacing.xs}>
        <Label weight="semibold">Versión de la aplicación</Label>
        <Label>1.0.0</Label>
      </Layout>

      <Layout gap={spacing.xs}>
        <Label weight="semibold">Framework</Label>
        <Layout direction="row" gap={spacing.xs} alignHorizontal="center">
          <Code2 color={theme.secondaryText} size={iconography.xs} />
          <Label>React Native + Expo</Label>
        </Layout>
      </Layout>

      <Layout gap={spacing.xs}>
        <Label weight="semibold">Desarrollado por</Label>

        <Label>Jennifer Tatiana Guerra Figueroa</Label>
        <Label>Milton Azareel Cuadra Mezquita</Label>
        <Label>Gilberto José Menéndez Pérez</Label>
        <Label>Daniel Alexander Reyes Pérez</Label>
        <Label>Marcos Enrique Ramos Hernández</Label>
      </Layout>

      {/* Repositorio */}
      <Layout
        direction="row"
        gap={spacing.sm}
        alignHorizontal="center"
        style={{ marginTop: spacing.sm }}
      >
        <Github color={theme.secondaryText} size={iconography.md} />
        <Label>github.com/marcosherna</Label>
      </Layout>
    </Layout>
  );
};

const TermAndConditionsComponent = () => {
  const { theme } = useTheme();

  return (
    <Layout
      paddingHorizontal={spacing.md}
      paddingVertical={spacing.md}
      gap={spacing.md}
    >
      {/* Header */}
      <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
        <FileText size={iconography.md} color={theme.secondaryText} />
        <Label size="lg" weight="bold">
          Términos y Condiciones
        </Label>
      </Layout>

      {/* Intro */}
      <Label paragraph>
        Al utilizar esta aplicación, aceptas cumplir con las políticas y reglas
        que se describen a continuación. Estos términos están diseñados para
        proteger tu seguridad, privacidad y garantizar un uso adecuado de la
        plataforma.
      </Label>

      <Divider margin={spacing.md} />

      {/* Sección 1: Uso de la aplicación */}
      <Layout gap={spacing.xs}>
        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <Globe color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">1. Uso de la aplicación</Label>
        </Layout>

        <Label paragraph>
          El usuario se compromete a utilizar la aplicación únicamente con fines
          legítimos y de acuerdo a la legislación vigente. No se permite usar la
          plataforma para actividades que dañen su funcionamiento o afecten a
          otros usuarios.
        </Label>
      </Layout>

      {/* Sección 2: Privacidad */}
      <Layout gap={spacing.xs}>
        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <ShieldCheck color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">2. Privacidad y manejo de datos</Label>
        </Layout>

        <Label paragraph>
          La aplicación recopila información mínima necesaria para brindarte un
          mejor servicio. Todos los datos son tratados bajo estrictas medidas de
          seguridad y nunca serán compartidos sin tu consentimiento.
        </Label>
      </Layout>

      {/* Sección 3: Seguridad */}
      <Layout gap={spacing.xs}>
        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <Lock color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">3. Seguridad de la cuenta</Label>
        </Layout>

        <Label paragraph>
          Eres responsable de mantener la confidencialidad de tu cuenta y tus
          credenciales. Notifícanos inmediatamente si detectas actividad
          sospechosa o acceso no autorizado.
        </Label>
      </Layout>

      {/* Sección 4: Cambios en los términos */}
      <Layout gap={spacing.xs}>
        <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
          <AlertTriangle color={theme.secondaryText} size={iconography.sm} />
          <Label weight="semibold">4. Actualización de los términos</Label>
        </Layout>

        <Label paragraph>
          Nos reservamos el derecho de actualizar o modificar estos términos en
          cualquier momento. Te recomendamos revisar esta sección periódicamente
          para mantenerte informado.
        </Label>
      </Layout>

      <Divider margin={spacing.md} />

      {/* Nota final */}
      <Label color="gray" paragraph>
        Al continuar utilizando la aplicación, confirmas que has leído y
        aceptado estos Términos y Condiciones.
      </Label>
    </Layout>
  );
};

const AlertDeleteSessionComponent = () => {
  return (
    <Layout
      paddingHorizontal={spacing.md}
      paddingVertical={spacing.lg}
      gap={spacing.lg}
    >
      {/* Encabezado con ícono */}
      <Layout
        direction="row"
        alignHorizontal="center"
        alignVertical="center"
        gap={spacing.sm}
      >
        <AlertTriangle size={28} color="red" />
        <Label size="lg" weight="bold" color="red">
          ¿Eliminar cuenta?
        </Label>
      </Layout>

      {/* Descripción */}
      <Layout gap={spacing.sm}>
        <Label>Esta acción es permanente y no se puede deshacer.</Label>

        <Layout
          direction="row"
          alignHorizontal="center"
          alignVertical="center"
          gap={spacing.xs}
        >
          <ShieldAlert size={18} color="red" />
          <Label>
            Se eliminarán tus datos de forma segura, pero perderás acceso a la
            aplicación.
          </Label>
        </Layout>
      </Layout>

      <Divider margin={spacing.md} />

      {/* Botones de acción */}
      <Layout direction="row" gap={spacing.md}>
        <Button
          title="Cancelar"
          variant="outline"
          style={{ flex: 1 }}
          onPress={() => {}}
        />

        <Button
          title="Eliminar"
          style={{ flex: 1 }}
          onPress={() => {
            console.log("Cuenta eliminada");
          }}
        />
      </Layout>
    </Layout>
  );
};

type OptionBttSheet = "about" | "terms" | "alertDeleteSession";

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

  const renderContent = useMemo(() => {
    if (option === "about") return <AboutComponent />;
    if (option === "terms") return <TermAndConditionsComponent />;
    if (option === "alertDeleteSession") return <AlertDeleteSessionComponent />;
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

  const handleOpenBttSheet = (option: OptionBttSheet) => {
    setOption(option);
    bttSheet.current?.present();
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
      <ScrollView style={{ flex: 1, padding: spacing.md }}>
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
            Informacion Personal
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
              <Divider margin={spacing.xs} />

              <Layout
                direction="row"
                gap={spacing.md}
                marginTop={spacing.xs}
                alignHorizontal="center"
              >
                <GestureIconButton
                  icon="KeyRound"
                  size={iconography.xs}
                  variant="contained"
                />
                <Label>Cambiar Contrasenia</Label>
              </Layout>
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
