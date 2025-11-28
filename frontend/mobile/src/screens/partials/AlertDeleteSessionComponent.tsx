import { useState } from "react";
import { StyleSheet } from "react-native";
import { AlertTriangle, ShieldAlert } from "lucide-react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { Button, Label } from "../../components";
import { Divider, Layout } from "../../components/ui";

import { spacing } from "../../resourses/spacing";

import { useTheme } from "../../hooks/useTheme";

export const AlertDeleteSessionComponent = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (password: string) => void;
}) => {
  const { theme } = useTheme();

  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    if (password === "") return;
    onConfirm(password);
  };

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

      <Layout gap={6} style={{ marginBottom: 16 }} fullWidth>
        <Label>Contraseña actual</Label>

        <BottomSheetTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Ingrese su contraseña actual"
          placeholderTextColor={theme.secondaryText}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: password === "" ? "red" : theme.outline,
              color: theme.text,
            },
          ]}
        />

        {password === "" ? (
          <Label color="red">La contraseña es requerida.</Label>
        ) : null}
      </Layout>

      <Divider margin={spacing.md} />

      {/* Botones de acción */}
      <Layout direction="row" gap={spacing.md}>
        <Button
          title="Cancelar"
          variant="outline"
          style={{ flex: 1 }}
          onPress={onCancel}
        />

        <Button
          title="Eliminar"
          style={{ flex: 1 }}
          onPress={() => handleConfirm()}
        />
      </Layout>
    </Layout>
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
