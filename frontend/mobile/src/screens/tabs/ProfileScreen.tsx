import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { RootStackNavigation } from "../../navigations/params";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../network/firebase";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";
import { ProductList } from "../../components/profile/ProductList";
import { FavoritesList } from "../../components/profile/FavoritesList";
import { usePhotoPicker } from "../../components/profile/PhotoPicker";

import { spacing } from "../../resourses/spacing";
<<<<<<< HEAD
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

import { uploadProfilePhoto } from "../../network/services/imageUpload";
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

type SlimProduct = {
  id: string;
  name: string;
  price: number;
  imgCover?: string;
};
=======
import { Label, IconButton, Button } from "../../components";
>>>>>>> 2638447 (favoritos)

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();
  const { theme } = useTheme();

<<<<<<< HEAD
  const [activeTab, setActiveTab] = React.useState<"favorites" | "myProducts">(
    "myProducts"
  );
=======
  const [tab, setTab] = useState<"myProducts" | "favorites">("myProducts");
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);
>>>>>>> 2638447 (favoritos)

  /* FOTO */
  const {
    photo,
    loading: updatingPhoto,
    openOptions,
  } = usePhotoPicker(user?.photoURL ?? null);

<<<<<<< HEAD
  // ---- Mis productos ----
  React.useEffect(() => {
    if (!user?.uid) {
      setProductCount(0);
      setProducts([]);
      return;
    }
    const qCount = query(
      collection(db, "products"),
      where("createdBy", "==", user.uid)
    );
    const off1 = onSnapshot(qCount, (snap) => setProductCount(snap.size));
=======
  /* MIS PRODUCTOS */
  useEffect(() => {
    if (!user?.uid) return;
>>>>>>> 2638447 (favoritos)

    const q = query(
      collection(db, "products"),
      where("createdBy", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name: data.name,
          price: data.price,
          imgCover: data.imgCover ?? data.images?.[0],
        });
      });
      setProducts(list);
      setProductCount(snap.size);
    });
  }, [user?.uid]);

<<<<<<< HEAD
  // ---- Favoritos (ajusta a tu esquema) ----
  React.useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }
    // Opción A: favoritos denormalizados: {userId, name, price, imgCover}
    const qFav = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );
    const off = onSnapshot(qFav, (snap) => {
      const rows: SlimProduct[] = [];
=======
  /* FAVORITOS */
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      const list: any[] = [];
>>>>>>> 2638447 (favoritos)
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: data.productId,
          name: data.name,
          price: data.price,
          imgCover: data.imgCover,
        });
      });
      setFavorites(list);
    });
  }, [user?.uid]);

<<<<<<< HEAD
  // Foto de perfil
  const [updatingPhoto, setUpdatingPhoto] = React.useState(false);
  const [photo, setPhoto] = React.useState<string | null>(
    user?.photoURL ?? null
  );
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

      // 1) Subir a Cloudinary (carpeta users/<uid>)
      const url = await uploadProfilePhoto(uri, user.uid);

      // 2) Guardar la URL en Firebase Auth (photoURL)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }

      // 3) Actualizar UI local
      setPhoto(url);
      Alert.alert("Listo", "Tu foto de perfil se actualizó.");
    } catch (e: any) {
      console.log("cloudinary upload error:", e?.message);
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
    Alert.alert(
      "Eliminar producto",
      `¿Eliminar "${name ?? "este producto"}"?`,
      [
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
      ]
    );
  };

  if (loading) {
=======
  /* EDITAR / ELIMINAR PRODUCTO */
  const deleteProduct = (id: string, name?: string) => {
    navigation.navigate("editProducto", { id, name: name || "" } as any);
  };

  if (loading)
>>>>>>> 2638447 (favoritos)
    return (
      <SafeAreaView style={styles.center}>
        <View />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          gap: spacing.lg,
        }}
      >
        {/* CUANDO NO HAY USUARIO */}
        {!user ? (
<<<<<<< HEAD
          <View style={styles.card}>
            <Text style={styles.text}>No has iniciado sesión.</Text>
            <View style={{ gap: 8 }}>
              <Button
                title="Iniciar sesión"
                onPress={() => navigation.navigate("authLogin")}
              />
              <Button
                title="Crear cuenta"
                onPress={() => navigation.navigate("authRegister")}
              />
            </View>
          </View>
        ) : (
          <>
            {/* Perfil */}
            <View style={[styles.card, styles.profileRow]}>
              <TouchableOpacity
                onPress={handleChangePhoto}
                activeOpacity={0.85}
              >
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
                <Text style={styles.value}>
                  {user?.displayName || "Sin nombre"}
                </Text>

                <Text style={[styles.label, { marginTop: 6 }]}>Correo</Text>
                <Text style={styles.value}>{user?.email || "—"}</Text>

                <Text style={styles.counter}>
                  Productos publicados:{" "}
                  <Text style={styles.counterNum}>{productCount}</Text>
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
                  <PlusSquare
                    size={18}
                    color={activeTab === "myProducts" ? "#2563eb" : "#111"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabIcon,
                    activeTab === "favorites" && styles.tabIconActive,
                  ]}
                  onPress={() => setActiveTab("favorites")}
                >
                  <Heart
                    size={18}
                    color={activeTab === "favorites" ? "#2563eb" : "#111"}
                  />
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
=======
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.outline,
                alignItems: "center",
                gap: spacing.md,
              },
            ]}
          >
            <Label size="lg" weight="bold" color={theme.text}>
              No has iniciado sesión
            </Label>

            <Button
              title="Iniciar sesión"
              variant="primary"
              onPress={() => navigation.navigate("authLogin")}
              style={{ minWidth: 160 }}
            />
          </View>
        ) : (
          <>
            {/* HEADER */}
            <ProfileHeader
              photo={photo}
              updatingPhoto={updatingPhoto}
              name={user.displayName || "Usuario"}
              email={user.email || ""}
              productCount={productCount}
              onChangePhoto={openOptions}
              onEditProfile={() => {}}
              onLogout={signOut}
            />

            {/* TABS + LISTA */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.outline,
                },
              ]}
            >
              <ProfileTabs active={tab} onChange={setTab} />

              {/* BOTÓN NUEVO (SOLO SI TAB = MIS PRODUCTOS) */}
              {tab === "myProducts" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Label size="xl" weight="bold" color={theme.text}>
                    Mis productos
                  </Label>

                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: theme.primary,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 14,
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <IconButton
                      icon="Plus"
                      size={14}
                      color="#fff"
                      colorShape="transparent"
                      variant="ghost"
                      onPress={() => navigation.navigate("addProducto")}
                    />
                    <Label color="#fff" weight="bold" size="sm">
                      Nuevo
                    </Label>
                  </View>
                </View>
              )}

              {/* LISTAS */}
              {tab === "myProducts" ? (
                <ProductList data={products} onDelete={deleteProduct} />
              ) : (
                <FavoritesList data={favorites} />
              )}
>>>>>>> 2638447 (favoritos)
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
<<<<<<< HEAD
  text: { marginBottom: 12 },
  // perfil
  profileRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  profileInfo: { flex: 1, minWidth: 0 },
  label: { fontWeight: "bold" },
  value: { marginBottom: 2, flexShrink: 1 },
  counter: { marginTop: 8, color: "#475569" },
  counterNum: { fontWeight: "700", color: "#111827" },

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
=======
  center: {
    flex: 1,
>>>>>>> 2638447 (favoritos)
    justifyContent: "center",
    alignItems: "center",
  },
});
