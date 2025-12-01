import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Plus } from "lucide-react-native";

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

import useFavorites from "../../hooks/useFavorites";

import { spacing } from "../../resourses/spacing";
import { Label, IconButton, Button } from "../../components";
import { GestureLayout, Layout } from "../../components/ui";
import { iconography } from "../../resourses/iconography";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { PhotoOptionsModal } from "../../components/profile/PhotoOptionsModal"; // Importamos el Modal externo

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();
  const { theme } = useTheme();

  const [tab, setTab] = useState<"myProducts" | "favorites">("myProducts");
  const [products, setProducts] = useState<any[]>([]);
  const { favorites, loading: loadingFavorites } = useFavorites(user?.uid);
  const [productCount, setProductCount] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  /* FOTO */
  const {
    photo,
    loading: updatingPhoto,
    pickFromGallery,
    takePhoto,
    removePhoto,
  } = usePhotoPicker(user?.photoURL ?? null);

  // Función para abrir el Modal de opciones de foto
  const handleOpenPhotoOptions = () => {
    setShowPhotoOptions(true);
  };

  /* MIS PRODUCTOS */
  useEffect(() => {
    if (!user?.uid) return;
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

  /* EDITAR / ELIMINAR PRODUCTO */
  const deleteProduct = async (id: string, name?: string) => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que deseas eliminar "${
        name ?? "este producto"
      }"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { doc, deleteDoc } = await import("firebase/firestore");
              const { db } = await import("../../network/firebase");
              await deleteDoc(doc(db, "products", id));
              setProducts((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Eliminado", "El producto ha sido eliminado.");
            } catch (e) {
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          },
        },
      ]
    );
  };

  if (loading)
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
        {/* SIN USUARIO */}
        {!user ? (
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
            <ProfileHeader
              photo={photo}
              updatingPhoto={updatingPhoto}
              name={user.displayName || "Usuario"}
              email={user.email || ""}
              productCount={productCount}
              onChangePhoto={handleOpenPhotoOptions}
              onEditProfile={() => navigation.navigate("settingScreen")}
              onLogout={signOut}
            />
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
                  <GestureLayout
                    variant="contained"
                    onPress={() => navigation.navigate("addProducto")}
                  >
                    <Layout
                      direction="row"
                      gap={spacing.sm}
                      alignVertical="center"
                      alignHorizontal="center"
                    >
                      <Plus color={"#fff"} size={iconography.sm} />
                      <Label color="#fff">Nuevo</Label>
                    </Layout>
                  </GestureLayout>
                </View>
              )}
              {/* LISTAS */}
              {tab === "myProducts" ? (
                <ProductList
                  data={products}
                  onDelete={deleteProduct}
                  onEdit={(id) =>
                    navigation.navigate("addProducto", { editId: id })
                  }
                />
              ) : loadingFavorites ? (
                <Label>Cargando favoritos...</Label>
              ) : (
                <FavoritesList data={favorites} />
              )}
            </View>
          </>
        )}
      </ScrollView>
      <EditProfileModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        user={user}
      />

      {/* 🛑 LLAMADA AL MODAL EXTERNO DE FOTOS 🛑 */}
      <PhotoOptionsModal
        visible={showPhotoOptions}
        onClose={() => setShowPhotoOptions(false)}
        pickFromGallery={pickFromGallery}
        takePhoto={takePhoto}
        removePhoto={removePhoto}
      />
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
