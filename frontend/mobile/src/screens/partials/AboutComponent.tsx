import {
  Code2,
  Github,
  Info,
  Rocket,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";

import { Label } from "../../components";
import { Divider, Layout } from "../../components/ui";

import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";

import { useTheme } from "../../hooks/useTheme";

export const AboutComponent = () => {
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
