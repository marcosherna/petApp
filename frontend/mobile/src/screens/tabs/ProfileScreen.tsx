import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

import { Button } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { RootStackNavigation } from "../../navigations/params";
import { auth, storage } from "../../network/firebase" ; // <-- tus exports

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();

  const goToLogin = () => navigation.navigate("authLogin");

  const [updatingPhoto, setUpdatingPhoto] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(user?.photoURL ?? null);

  React.useEffect(() => {
    setPhoto(user?.photoURL ?? null);
  }, [user?.photoURL]);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos requeridos", "Necesitamos acceso a tus fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset?.uri) return;
    await uploadAndSetPhoto(asset.uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos requeridos", "Necesitamos acceso a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset?.uri) return;
    await uploadAndSetPhoto(asset.uri);
  };

  const uploadAndSetPhoto = async (uri: string) => {
    if (!user) return;
    try {
      setUpdatingPhoto(true);

      // convierte a blob
      const res = await fetch(uri);
      const blob = await res.blob();

      // nombre fijo para sobreescribir o usa timestamp si prefieres versionado
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, blob, {
        contentType: blob.type || "image/jpeg",
      });

      const url = await getDownloadURL(storageRef);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }

      setPhoto(url);
      Alert.alert("Listo", "Tu foto de perfil se actualizó.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo actualizar la foto. Intenta nuevamente.");
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const removePhoto = async () => {
    try {
      if (!auth.currentUser) return;
      setUpdatingPhoto(true);
      await updateProfile(auth.currentUser, { photoURL: null }); // elimina foto
      setPhoto(null);
      Alert.alert("Listo", "Se removió tu foto de perfil.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo eliminar la foto.");
    } finally {
      setUpdatingPhoto(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        {!user ? (
          <View style={styles.card}>
            <Text style={styles.text}>No has iniciado sesión.</Text>
            <Button title="Iniciar sesión" onPress={goToLogin} />
          </View>
        ) : (
          <>
            {/* FOTO */}
            <View style={[styles.card, styles.center]}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={{ color: "#666" }}>Sin foto</Text>
                </View>
              )}

              <View style={{ height: 12 }} />

              <View style={styles.photoRow}>
                <Button
                  title={updatingPhoto ? "Actualizando..." : "Galería"}
                  onPress={pickFromGallery}
                  disabled={updatingPhoto}
                />
                <Button
                  title="Cámara"
                  onPress={takePhoto}
                  disabled={updatingPhoto}
                />
                <Button
                  title="Quitar"
                  onPress={removePhoto}
                  disabled={updatingPhoto || !photo}
                />
              </View>
            </View>

            {/* DATOS */}
            <View style={styles.card}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{user?.displayName || "Sin nombre"}</Text>

              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{user?.email || "—"}</Text>
            </View>

            <Button title="Cerrar sesión" onPress={signOut} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 20 },
  title: { fontSize: 24, fontWeight: "600" },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 16, gap: 10 },
  label: { fontWeight: "bold" },
  value: { marginBottom: 10 },
  text: { marginBottom: 12 },
  center: { justifyContent: "center", alignItems: "center" },
  photoRow: { flexDirection: "row", gap: 10 },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
});
