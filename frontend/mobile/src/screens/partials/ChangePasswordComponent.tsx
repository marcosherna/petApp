import { Alert, StyleSheet } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Layout, Loading } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import { Button, Label } from "../../components";
import { spacing } from "../../resourses/spacing";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { changeUserPassword } from "../../network/services/authService";

export const ChangePasswordComponent = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const { values, errors, handleChange, validateForm, resetForm } = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validations: {
      currentPassword: (v) => (!v ? "Campo requerido" : null),
      newPassword: (v) => {
        if (!v) return "Campo requerido";
        if (v.length < 6) return "Debe tener mínimo 6 caracteres";
        return null;
      },
      confirmPassword: (v, values) => {
        if (!v) return "Campo requerido";
        if (v !== values.newPassword) return "Las contraseñas no coinciden";
        return null;
      },
    },
  });

  const { theme } = useTheme();
  const inset = useSafeAreaInsets();
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const isValid = validateForm();
      if (!isValid) return;

      await changeUserPassword(
        user!,
        values.currentPassword,
        values.newPassword
      );

      resetForm();
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      if (onClose) onClose();
    } catch (error: any) {
      alert("Error al actualizar contraseña: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout
        paddingHorizontal={spacing.md}
        style={{ paddingBottom: inset.bottom + spacing.lg }}
        fullWidth
      >
        <Layout gap={6} style={{ marginBottom: 16 }} fullWidth>
          <Label>Contraseña actual</Label>

          <BottomSheetTextInput
            value={values.currentPassword}
            onChangeText={(t) => handleChange("currentPassword", t)}
            placeholder="Ingrese su contraseña actual"
            placeholderTextColor={theme.secondaryText}
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: errors.currentPassword ? "red" : theme.outline,
                color: theme.text,
              },
            ]}
          />

          {errors.currentPassword ? (
            <Label color="red">{errors.currentPassword}</Label>
          ) : null}
        </Layout>

        <Layout gap={6} style={{ marginBottom: 16 }} fullWidth>
          <Label>Nueva contraseña</Label>

          <BottomSheetTextInput
            value={values.newPassword}
            onChangeText={(t) => handleChange("newPassword", t)}
            placeholder="Ingrese su nueva contraseña"
            placeholderTextColor={theme.secondaryText}
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: errors.newPassword ? "red" : theme.outline,
                color: theme.text,
              },
            ]}
          />

          {errors.newPassword ? (
            <Label color="red">{errors.newPassword}</Label>
          ) : null}
        </Layout>

        <Layout gap={6} style={{ marginBottom: 16 }} fullWidth>
          <Label>Confirmar contraseña</Label>

          <BottomSheetTextInput
            value={values.confirmPassword}
            onChangeText={(t) => handleChange("confirmPassword", t)}
            placeholder="Confirme su nueva contraseña"
            placeholderTextColor={theme.secondaryText}
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: errors.confirmPassword ? "red" : theme.outline,
                color: theme.text,
              },
            ]}
          />

          {errors.confirmPassword ? (
            <Label color="red">{errors.confirmPassword}</Label>
          ) : null}
        </Layout>

        <Button
          title={loading ? "Actualizando..." : "Actualizar contraseña"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </Layout>

      <Loading visible={loading} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
  },
});
