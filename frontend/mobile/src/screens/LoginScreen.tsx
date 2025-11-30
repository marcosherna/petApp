import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";
import { PawPrint } from "lucide-react-native";

import { Button, Input, Label } from "../components";
import { Loading } from "../components/ui";
import { spacing } from "../resourses/spacing";

import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { RootStackNavigation } from "../navigations/params";

export default function LoginScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { sigIn } = useAuth();
  const { theme } = useTheme();

  const [loading, setLoading] = React.useState(false);

  const { values, errors, handleChange, validateForm, isFormValid } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validations: {
      email: (v) => (!/\S+@\S+\.\S+/.test(v) ? "Correo no válido" : null),
      password: (v) =>
        v.length < 8 ? "Debe tener al menos 8 caracteres" : null,
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await sigIn(values.email, values.password);
      navigation.reset({
        index: 0,
        routes: [{ name: "mainApp" }],
      });
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
        {/* LOGO */}
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
            Bienvenido de vuelta
          </Label>

          <Label
            size="md"
            align="center"
            color={theme.secondaryText}
            style={{ marginTop: spacing.xs }}
          >
            Inicia sesión para continuar 🐾
          </Label>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
          <Input
            label="Correo"
            placeholder="example.user@gmail.com"
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
        </View>

        {/* BOTÓN */}
        <Button
          title="Iniciar sesión"
          onPress={handleSubmit}
          disabled={!isFormValid()}
          style={{ marginTop: spacing.md }}
        />

        {/* LINK A REGISTRO */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("authRegister")}
        >
          <Label size="sm" color={theme.primary} weight="medium">
            ¿No tienes cuenta? Regístrate aquí
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
    marginBottom: spacing.md,
  },

  form: {
    gap: spacing.md,
  },

  registerLink: {
    marginTop: spacing.sm,
    alignSelf: "center",
  },
});
