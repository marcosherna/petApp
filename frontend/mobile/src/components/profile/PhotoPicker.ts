import { useState } from "react";
import { Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePhoto } from "../../network/services/imageUpload";
import { updateProfile } from "firebase/auth";
import { auth } from "../../network/firebase";

/**
 * Hook para manejar toda la lógica de foto de perfil:
 * - abrir opciones
 * - cámara / galería
 * - borrar foto
 * - subir y actualizar en Firebase Auth
 */
export function usePhotoPicker(initialPhoto: string | null) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;

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
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") return;

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

  const openOptions = () => {
    const options = ["Galería", "Cámara", "Quitar foto", "Cancelar"];
    const handlers = [pickFromGallery, takePhoto, removePhoto];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2,
        },
        (i) => {
          handlers[i] && handlers[i]();
        }
      );
    } else {
      Alert.alert("Foto de perfil", "Selecciona una opción", [
        { text: "Galería", onPress: pickFromGallery },
        { text: "Cámara", onPress: takePhoto },
        { text: "Quitar foto", style: "destructive", onPress: removePhoto },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return {
    photo,
    loading,
    openOptions,
  };
}
