import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";

interface PhotoOptionsProps {
  visible: boolean;
  onClose: () => void;
  pickFromGallery: () => void;
  takePhoto: () => void;
  removePhoto: () => void;
}

export function PhotoOptionsModal({
  visible,
  onClose,
  pickFromGallery,
  takePhoto,
  removePhoto,
}: PhotoOptionsProps) {
  const { theme } = useTheme();

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View
          style={[modalStyles.actionSheet, { backgroundColor: theme.surface }]}
          onStartShouldSetResponder={() => true}
        >
          <Text style={[modalStyles.title, { color: theme.text }]}>
            Foto de perfil
          </Text>
          {/* GALERÍA */}
          <TouchableOpacity
            style={modalStyles.option}
            onPress={() => handleAction(pickFromGallery)}
          >
            <Text style={modalStyles.text}>Galería</Text>
          </TouchableOpacity>
          {/* CÁMARA */}
          <TouchableOpacity
            style={modalStyles.option}
            onPress={() => handleAction(takePhoto)}
          >
            <Text style={modalStyles.text}>Cámara</Text>
          </TouchableOpacity>
          {/* QUITAR FOTO */}
          <TouchableOpacity
            style={modalStyles.option}
            onPress={() => handleAction(removePhoto)}
          >
            <Text style={modalStyles.destructiveText}>Quitar foto</Text>
          </TouchableOpacity>
          {/* BOTÓN CANCELAR */}
          <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
            <Text style={modalStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  actionSheet: {
    width: "75%",
    maxWidth: 320,
    borderRadius: 15,
    padding: spacing.sm,
    elevation: 5,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: spacing.sm,
    textAlign: "center",
  },
  option: {
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 16,
  },
  destructiveText: {
    fontSize: 16,
    color: "red",
  },
  cancelButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
