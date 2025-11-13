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
  useWindowDimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Heart, PlusSquare, Pencil, Trash2 } from "lucide-react-native";

import { Button, Label } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { RootStackNavigation } from "../../navigations/params";
import { auth, storage, db } from "../../network/firebase";
import { spacing } from "../../resourses/spacing";
import { EmptyTemplate } from "../../components/ui";
import { Product } from "../../network/models";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

/* ===================== Item UI reutilizable ===================== */

function ProductRow({
  item,
  showActions,
  onEdit,
  onDelete,
}: {
  item: { id: string; name: string; price: number; imgCover?: string };
  showActions?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: string, name?: string) => void;
}) {
  return (
    <View style={styles.productRow}>
      <Image
        source={{ uri: item.imgCover || "https://via.placeholder.com/80" }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text numberOfLines={1} style={styles.productName}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>

      {showActions ? (
        <View style={styles.productActions}>
          {/* este es apartado de editar */}
          {/* <TouchableOpacity
            style={[styles.iconButton, { borderColor: "#007BFF" }]}
            onPress={() => onEdit && onEdit(item)}
          >
            <Pencil size={18} color="#007BFF" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: "#E4080A" }]}
            onPress={() => onDelete && onDelete(String(item.id), item.name)}
          >
            <Trash2 size={18} color="#E4080A" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

/* ===================== Pantalla ===================== */

type SlimProduct = { id: string; name: string; price: number; imgCover?: string };

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();
  const { height } = useWindowDimensions();

  const [activeTab, setActiveTab] = React.useState<"favorites" | "myProducts">("myProducts");

  // Contador y listas
  const [productCount, setProductCount] = React.useState<number>(0);
  const [products, setProducts] = React.useState<SlimProduct[]>([]);
  const [favorites, setFavorites] = React.useState<SlimProduct[]>([]);

  // ---- Mis productos ----
  React.useEffect(() => {
    if (!user?.uid) {
      setProductCount(0);
      setProducts([]);
      return;
    }
    const qCount = query(collection(db, "products"), where("createdBy", "==", user.uid));
    const off1 = onSnapshot(qCount, (snap) => setProductCount(snap.size));

    const qList = query(
      collection(db, "products"),
      where("createdBy", "==", user.uid)
    );
    const off2 = onSnapshot(qList, (snap) => {
      const rows: SlimProduct[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        rows.push({
          id: d.id,
          name: data.name,
          price: data.price ?? 0,
          imgCover: data.imgCover ?? data.images?.[0],
        });
      });
      setProducts(rows);
    });

    return () => {
      off1();
      off2();
    };
  }, [user?.uid]);

  // ---- Favoritos (ajusta a tu esquema) ----
  React.useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }
    // Opción A: favoritos denormalizados: {userId, name, price, imgCover}
    const qFav = query(collection(db, "favorites"), where("userId", "==", user.uid));
    const off = onSnapshot(qFav, (snap) => {
      const rows: SlimProduct[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        rows.push({
          id: d.id, // o data.productId si quieres
          name: data.name,
          price: data.price ?? 0,
          imgCover: data.imgCover,
        });
      });
      setFavorites(rows);
    });
    return () => off();
  }, [user?.uid]);

  // Foto de perfil
  const [updatingPhoto, setUpdatingPhoto] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(user?.photoURL ?? null);
  React.useEffect(() => setPhoto(user?.photoURL ?? null), [user?.photoURL]);

  const handleChangePhoto = () => {
    const opts = ["Galería", "Cámara", "Quitar", "Cancelar"];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: opts,
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2,
          userInterfaceStyle: "light",
        },
        async (i) => {
          if (i === 0) return pickFromGallery();
          if (i === 1) return takePhoto();
          if (i === 2) return removePhoto();
        }
      );
    } else {
      Alert.alert("Foto de perfil", "Elige una opción", [
        { text: "Galería", onPress: pickFromGallery },
        { text: "Cámara", onPress: takePhoto },
        { text: "Quitar", style: "destructive", onPress: removePhoto },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos requeridos", "Necesitamos acceso a tus fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
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
      const res = await fetch(uri);
      const blob = await res.blob();
      const fileType = blob.type || "image/jpeg";
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      const task = uploadBytesResumable(storageRef, blob, { contentType: fileType });
      await new Promise<void>((resolve, reject) => {
        task.on("state_changed", undefined, reject, resolve);
      });
      const url = await getDownloadURL(storageRef);
      if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: url });
      setPhoto(url);
      Alert.alert("Listo", "Tu foto de perfil se actualizó.");
    } catch {
      Alert.alert("Error", "No se pudo actualizar la foto.");
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
    } catch {
      Alert.alert("Error", "No se pudo eliminar la foto.");
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const handleEditProduct = (item: any) => navigation.navigate("addProducto");
  const handleDeleteProduct = (id: string, name?: string) => {
    Alert.alert("Eliminar producto", `¿Eliminar "${name ?? "este producto"}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "products", id));
          } catch {
            Alert.alert("Error", "No se pudo eliminar el producto.");
          }
        },
      },
    ]);
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

  const dataToRender = activeTab === "favorites" ? favorites : products;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ÚNICO SCROLL GENERAL */}
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!user ? (
          <View style={styles.card}>
            <Text style={styles.text}>No has iniciado sesión.</Text>
            <View style={{ gap: 8 }}>
              <Button title="Iniciar sesión" onPress={() => navigation.navigate("authLogin")} />
              <Button title="Crear cuenta" onPress={() => navigation.navigate("authRegister")} />
            </View>
          </View>
        ) : (
          <>
            {/* Perfil */}
            <View style={[styles.card, styles.profileRow]}>
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
              
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{user?.displayName || "Sin nombre"}</Text>

                <Text style={[styles.label, { marginTop: 6 }]}>Correo</Text>
                <Text style={styles.value}>{user?.email || "—"}</Text>

                <Text style={styles.counter}>
                  Productos publicados: <Text style={styles.counterNum}>{productCount}</Text>
                </Text>
                <Button title="Cerrar sesión" onPress={signOut} />
              </View>
            </View>

            {/* Sección dinámica */}
            <View style={styles.card}>
                <View style={styles.tabsBar}>
                  <TouchableOpacity
                    style={[
                      styles.tabIcon,
                      activeTab === "myProducts" && styles.tabIconActive,
                    ]}
                    onPress={() => setActiveTab("myProducts")}
                  >
                    <PlusSquare size={18} color={activeTab === "myProducts" ? "#2563eb" : "#111"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabIcon,
                      activeTab === "favorites" && styles.tabIconActive,
                    ]}
                    onPress={() => setActiveTab("favorites")}
                  >
                    <Heart size={18} color={activeTab === "favorites" ? "#2563eb" : "#111"} />
                  </TouchableOpacity>
              </View>
              <View style={styles.headerRow}>
                <Label size="xl" weight="bold">
                  {activeTab === "favorites" ? "Favoritos" : "Mis productos"}
                </Label>

                {activeTab === "myProducts" && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("addProducto")}
                    style={styles.addPill}
                  >
                    <PlusSquare size={16} color="#fff" />
                    <Text style={styles.addPillText}>Nuevo</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* FlatList SIN scroll propio */}
              <FlatList
                data={dataToRender}
                keyExtractor={(it) => String(it.id)}
                renderItem={({ item }) => (
                  <ProductRow
                    item={item}
                    showActions={activeTab === "myProducts"}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                scrollEnabled={false}
                ListEmptyComponent={
                  <EmptyTemplate
                    message={
                      activeTab === "favorites"
                        ? "Sin favoritos por ahora"
                        : "Aún no tienes productos"
                    }
                    subMessage={
                      activeTab === "favorites"
                        ? "Marca productos con ❤️ para verlos aquí"
                        : "Pulsa el botón Nuevo para publicar"
                    }
                    icon={activeTab === "favorites" ? "heart" : "package"}
                  />
                }
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== Estilos ===================== */

const AVATAR_SIZE = 100;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center", flex: 1 },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    backgroundColor: "white",
  },
  text: { marginBottom: 12 },
  // perfil
  profileRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  profileInfo: { flex: 1, minWidth: 0 },
  label: { fontWeight: "bold" },
  value: { marginBottom: 2, flexShrink: 1 },
  counter: { marginTop: 8, color: "#475569" },
  counterNum: { fontWeight: "700", color: "#111827" },

  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  // barra de tabs de iconos
  tabsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "flex-start",
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 10,
  },
  tabIconActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },

  // header sección productos/favoritos
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  addPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  addPillText: { color: "white", fontWeight: "600" },

  // fila de producto
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  productPrice: { color: "#007BFF", fontWeight: "bold" },
  productActions: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconButton: { borderWidth: 1, borderRadius: 8, padding: 4 },
});
