import {
  FileText,
  Globe,
  ShieldCheck,
  Lock,
  AlertTriangle,
} from "lucide-react-native";
import { Divider, Layout } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import { iconography } from "../../resourses/iconography";
import { spacing } from "../../resourses/spacing";
import { Label } from "../../components";

export const TermAndConditionsComponent = () => {
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
