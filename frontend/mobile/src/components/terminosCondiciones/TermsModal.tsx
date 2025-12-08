import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Label, Button } from "../index";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function TermsModal({ visible, onClose }: Props) {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.modal,
          {
            backgroundColor: theme.surface,
            borderColor: theme.outline,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: "80%" }}
        >
          <Label size="xl" weight="bold" color={theme.text}>
            Términos y Condiciones
          </Label>

          <Label
            size="sm"
            color={theme.secondaryText}
            style={{ marginTop: 12, lineHeight: 20 }}
          >
            Al crear una cuenta en PetMark aceptas que:
            {"\n\n"}• No subirás contenido ofensivo.
            {"\n"}• Los productos deben ser reales y propios.
            {"\n"}• Las imágenes deben cumplir normas adecuadas.
            {"\n"}• Tus datos solo se usan dentro de la aplicación.
            {"\n\n"}
            Este texto puede modificarse según tus necesidades.
          </Label>
        </ScrollView>

        <Button title="Cerrar" onPress={onClose} style={{ marginTop: 16 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 999,
  },
  modal: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
});
