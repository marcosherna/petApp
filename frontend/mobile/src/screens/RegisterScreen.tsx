import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";
import { PawPrint } from "lucide-react-native";

import { Loading } from "../components/ui";
import { Button, Input, Label } from "../components";
import { spacing } from "../resourses/spacing";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { RootStackNavigation } from "../navigations/params";

export default function RegisterScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { register } = useAuth();
  const { theme } = useTheme();

  const [loading, setLoading] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const { values, errors, handleChange, validateForm, isFormValid } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    validations: {
      name: (v) => (!v ? "El nombre es obligatorio" : null),
      email: (v) => (!/\S+@\S+\.\S+/.test(v) ? "Correo no válido" : null),
      password: (v) =>
        v.length < 8 ? "Debe tener al menos 8 caracteres" : null,
      confirm: (v, all) =>
        v !== all.password ? "Las contraseñas no coinciden" : null,
    },
  });

  const handleSubmit = async () => {
    if (!validateForm() || !acceptedTerms) return;
    try {
      setLoading(true);
      await register(values.name, values.email, values.password);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO CIRCULAR */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: theme.primary + "22" },
            ]}
          >
            <PawPrint size={36} color={theme.primary} />
          </View>
        </View>

        {/* TITULO */}
        <View style={styles.header}>
          <Label size="4xl" weight="bold" align="center" color={theme.text}>
            Bienvenido
          </Label>

          <Label
            size="md"
            align="center"
            color={theme.secondaryText}
            style={{ marginTop: spacing.xs }}
          >
            Crea tu cuenta para empezar 🐾
          </Label>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
          <Input
            label="Nombre completo"
            placeholder="Ingresa tu nombre"
            value={values.name}
            onChangeText={(t) => handleChange("name", t)}
            error={errors.name}
          />

          <Input
            label="Correo electrónico"
            placeholder="tu.correo@gmail.com"
            value={values.email}
            keyboardType="email-address"
            onChangeText={(t) => handleChange("email", t)}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            showTogglePassword
            value={values.password}
            onChangeText={(t) => handleChange("password", t)}
            error={errors.password}
          />

          <Input
            label="Confirmar contraseña"
            placeholder="Vuelve a escribir la contraseña"
            secureTextEntry
            showTogglePassword
            value={values.confirm}
            onChangeText={(t) => handleChange("confirm", t)}
            error={errors.confirm}
          />
        </View>

        {/* ACEPTAR TERMINOS */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: theme.primary,
                backgroundColor: acceptedTerms ? theme.primary : "transparent",
              },
            ]}
          />
          <Label size="sm" color={theme.text}>
            Acepto los{" "}
            <Label size="sm" color={theme.primary} weight="bold">
              Términos y Condiciones
            </Label>
          </Label>
        </TouchableOpacity>

        {/* BOTÓN */}
        <Button
          title="Crear Cuenta"
          onPress={handleSubmit}
          disabled={!isFormValid() || !acceptedTerms}
          style={{ marginTop: spacing.md }}
        />

        {/* LINK A LOGIN */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("authLogin")}
        >
          <Label size="sm" color={theme.primary} weight="medium">
            ¿Ya tienes cuenta? Inicia sesión
          </Label>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Loading visible={loading} />
    </SafeAreaView>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.lg,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
  },

  form: {
    gap: spacing.md,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },

  loginLink: {
    marginTop: spacing.sm,
    alignSelf: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 42,
    padding: 4,
  },
});
