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

import useFavorites from "../../hooks/useFavorites"; // 👈 IMPORTANTE

import { spacing } from "../../resourses/spacing";
import { Label, IconButton, Button } from "../../components";
import { EditProfileModal } from "../../components/profile/EditProfileModal";

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, loading, signOut } = useAuth();
  const { theme } = useTheme();

  const [tab, setTab] = useState<"myProducts" | "favorites">("myProducts");
  const [products, setProducts] = useState<any[]>([]);
  const { favorites, loading: loadingFavorites } = useFavorites(user?.uid); // 👈 AHORA SE USA EL HOOK
  const [productCount, setProductCount] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  /* FOTO */
  const {
    photo,
    loading: updatingPhoto,
    openOptions,
  } = usePhotoPicker(user?.photoURL ?? null);

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
  const deleteProduct = (id: string, name?: string) => {
    navigation.navigate("editProducto", { id, name: name || "" } as any);
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
              onChangePhoto={openOptions}
              onEditProfile={() => setShowEdit(true)}
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
