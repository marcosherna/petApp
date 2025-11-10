// src/screens/tabs/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Feather } from "@expo/vector-icons";

import { Button } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { RootStackNavigation } from "../../navigations/params";
import { auth, storage } from "../../network/firebase";

// ---------- Tabs internos del perfil ----------
function FavoritesTab() {
  // Aquí renderizas la grilla/lista de favoritos del usuario
  return (
    <View style={tabStyles.container}>
      <Text style={tabStyles.text}>Tus favoritos aparecerán aquí.</Text>
    </View>
  );
}

function CreateTab() {
  // Aquí puedes renderizar un CTA o el flujo para crear contenido/publicación
  return (
    <View style={tabStyles.container}>
      <Text style={tabStyles.text}>Crea algo nuevo desde este tab.</Text>
    </View>
  );
}

const TopTabs = createMaterialTopTabNavigator();

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();

  const goToLogin = () => navigation.navigate("authLogin");
  const goToRegister = () => navigation.navigate("authRegister");

  const [updatingPhoto, setUpdatingPhoto] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(user?.photoURL ?? null);

  React.useEffect(() => {
    setPhoto(user?.photoURL ?? null);
  }, [user?.photoURL]);

  const handleChangePhoto = () => {
    const opts = ["Galería", "Cámara", "Quitar", "Cancelar"];
    const CANCEL_INDEX = 3;
    const DESTRUCTIVE_INDEX = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: opts,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          userInterfaceStyle: "light",
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) return pickFromGallery();
          if (buttonIndex === 1) return takePhoto();
          if (buttonIndex === 2) return removePhoto();
        }
      );
    } else {
      Alert.alert(
        "Foto de perfil",
        "Elige una opción",
        [
          { text: "Galería", onPress: pickFromGallery },
          { text: "Cámara", onPress: takePhoto },
          { text: "Quitar", style: "destructive", onPress: removePhoto },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

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
    if (!result.canceled && result.assets?.[0]?.uri) {
      await uploadAndSetPhoto(result.assets[0].uri);
    }
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
    if (!result.canceled && result.assets?.[0]?.uri) {
      await uploadAndSetPhoto(result.assets[0].uri);
    }
  };

  const uploadAndSetPhoto = async (uri: string) => {
    if (!user) return;
    try {
      setUpdatingPhoto(true);

      // convertir a blob
      const res = await fetch(uri);
      const blob = await res.blob();
      const fileType = blob.type || "image/jpeg";

      // subir a Storage (sobrescribe para mantener una sola foto)
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      const task = uploadBytesResumable(storageRef, blob, { contentType: fileType });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          // (snap) => console.log('progress', snap.bytesTransferred / snap.totalBytes),
          (error) => reject(error),
          () => resolve()
        );
      });

      const url = await getDownloadURL(storageRef);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }

      setPhoto(url);
      Alert.alert("Listo", "Tu foto de perfil se actualizó.");
    } catch (e: any) {
      console.log("storage upload error:", e?.code, e?.message);
      Alert.alert("Error", "No se pudo actualizar la foto. Revisa permisos/reglas y vuelve a intentar.");
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const removePhoto = async () => {
    try {
      if (!auth.currentUser) return;
      setUpdatingPhoto(true);
      await updateProfile(auth.currentUser, { photoURL: null });
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
            <View style={{ gap: 8 }}>
              <Button title="Iniciar sesión" onPress={goToLogin} />
              <Button title="Crear cuenta" onPress={goToRegister} />
            </View>
          </View>
        ) : (
          <>
            {/* HEADER del perfil (foto + datos) */}
            <View style={[styles.card, styles.center]}>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={{ color: "#666" }}>
                      {updatingPhoto ? "Actualizando…" : "Sin foto"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {updatingPhoto && (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator />
                </View>
              )}
              <Text style={{ marginTop: 8, color: "#666" }}>Toca la foto para cambiarla</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{user?.displayName || "Sin nombre"}</Text>

              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{user?.email || "—"}</Text>
            </View>

            {/* TABS estilo TikTok */}
            <View style={styles.tabsContainer}>
              <TopTabs.Navigator
                screenOptions={{
                  tabBarShowLabel: false,
                  tabBarIndicatorStyle: { height: 2.5, borderRadius: 2 },
                  tabBarStyle: { backgroundColor: "transparent", elevation: 0 },
                  tabBarItemStyle: { paddingVertical: 6 },
                }}
              >
                <TopTabs.Screen
                  name="FavoritesTab"
                  component={FavoritesTab}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <Feather name={focused ? "heart" : "heart"} size={22} />
                    ),
                  }}
                />
                <TopTabs.Screen
                  name="CreateTab"
                  component={CreateTab}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <Feather name="plus-square" size={22} />
                    ),
                  }}
                />
              </TopTabs.Navigator>
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
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  label: { fontWeight: "bold" },
  value: { marginBottom: 10 },
  text: { marginBottom: 12 },
  center: { justifyContent: "center", alignItems: "center" },
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
  tabsContainer: {
    height: 260, // ajusta según tu contenido interno; si usarás listas, podrías hacer esto flexible
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },
});

const tabStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" },
  text: { color: "#666" },
});
