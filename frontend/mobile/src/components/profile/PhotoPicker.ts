import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePhoto } from "../../network/services/imageUpload";
import { updateProfile } from "firebase/auth";
import { auth } from "../../network/firebase";

export function usePhotoPicker(initialPhoto: string | null) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [loading, setLoading] = useState(false);

  // --- Funciones de Acción (pickFromGallery, takePhoto, updatePhoto, removePhoto) se mantienen iguales ---
  const pickFromGallery = async () => {
    // ... lógica de galería ...
    // Añade la lógica de permisos si no está:
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Concede permiso a la galería para seleccionar una foto."
      );
      return;
    }
    const img = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!img.canceled) {
      updatePhoto(img.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // ... lógica de cámara ...
    // Añade la lógica de permisos si no está:
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Concede permiso a la cámara para tomar una foto."
      );
      return;
    }
    const img = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!img.canceled) {
      updatePhoto(img.assets[0].uri);
    }
  };

  const updatePhoto = async (uri: string) => {
    try {
      if (!auth.currentUser) return;
      setLoading(true);
      const url = await uploadProfilePhoto(uri, auth.currentUser.uid);
      await updateProfile(auth.currentUser, { photoURL: url });
      setPhoto(url);
    } catch {
      Alert.alert("Error", "No se pudo actualizar la foto.");
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = async () => {
    try {
      if (!auth.currentUser) return;
      await updateProfile(auth.currentUser, { photoURL: null });
      setPhoto(null);
    } catch {
      Alert.alert("Error", "No se pudo quitar la foto.");
    }
  };

  return {
    photo,
    loading,
    pickFromGallery, // ✅ Exportado
    takePhoto, // ✅ Exportado
    removePhoto, // ✅ Exportado
  };
}
