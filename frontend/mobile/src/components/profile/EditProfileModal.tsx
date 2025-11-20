import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";
import { Label, Input, Button, IconButton } from "../../components";
import { usePhotoPicker } from "./PhotoPicker";
import { updateProfile } from "firebase/auth";
import { auth } from "../../network/firebase";
import { X } from "lucide-react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  user: any;
}

export function EditProfileModal({ visible, onClose, user }: Props) {
  const { theme } = useTheme();

  const [name, setName] = useState(user?.displayName || "");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  const { photo, openOptions } = usePhotoPicker(user?.photoURL ?? null);

  const handleSave = async () => {
    await updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: photo,
    });

    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* FONDO OSCURO */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* TARJETA MODAL */}
      <View style={[styles.modal, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X size={22} color={theme.text} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Label size="xl" weight="bold" align="center" color={theme.text}>
            Editar Perfil
          </Label>

          {/* FOTO */}
          <TouchableOpacity style={styles.photoContainer} onPress={openOptions}>
            <Image
              source={{
                uri:
                  photo ||
                  user?.photoURL ||
                  "https://via.placeholder.com/150/cccccc",
              }}
              style={styles.photo}
            />

            <View style={styles.cameraButton}>
              <IconButton icon="Camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* CAMPOS */}
          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej: Jennifer"
          />

          <Input
            label="Apellido"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ej: Guerra"
          />

          <Input
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="Ej: +503 7777-7777"
            keyboardType="phone-pad"
          />

          <Input
            label="Dirección"
            value={address}
            onChangeText={setAddress}
            placeholder="Ej: San Salvador, El Salvador"
          />

          {/* BOTÓN GUARDAR */}
          <Button
            title="Guardar cambios"
            onPress={handleSave}
            style={{ marginTop: spacing.lg }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    position: "absolute",
    top: "10%",
    left: "5%",
    right: "5%",
    borderRadius: 20,
    padding: spacing.lg,
    elevation: 10,
    maxHeight: "85%",
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 10,
  },
  photoContainer: {
    alignSelf: "center",
    marginVertical: spacing.md,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 70,
  },
  cameraButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#0008",
    borderRadius: 20,
    padding: 6,
  },
});
