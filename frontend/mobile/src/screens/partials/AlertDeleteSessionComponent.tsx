import { AlertTriangle, ShieldAlert } from "lucide-react-native";

import { Button, Label } from "../../components";
import { Divider, Layout } from "../../components/ui";

import { spacing } from "../../resourses/spacing";

export const AlertDeleteSessionComponent = () => {
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