import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Star, MapPin } from "lucide-react-native";

import { ProductDetailScreenProps } from "../navigations/params";

import { Divider, ImageCarousel, Layout, Segment } from "../components/ui";
import {
  Button,
  IconButton,
  Label,
  FavoriteButton,
  PressableLayout,
  // Importaciones completas
} from "../components";

import { spacing } from "../resourses/spacing";
import { iconography } from "../resourses/iconography";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useGlobalBottomSheetModal } from "../hooks/useGlobalBottomSheetModal";
import { RateProduct } from "./partials/RateProduct";

// 🔥 FAVORITOS SERVICES
import {
  addFavorite,
  removeFavorite,
  isProductFavorite,
} from "../network/services/favorites";

const { width } = Dimensions.get("window");

// --- Mapa ---
const SellerMap: React.FC<any> = ({ lat, lng, height = 220, radius = 12 }) => {
  return (
    <View style={{ height, borderRadius: radius, overflow: "hidden" }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: lat ?? 13.68935,
          longitude: lng ?? -89.18718,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
      </MapView>
    </View>
  );
};

export default function ProductDetailScreen({
  navigation,
  route,
}: ProductDetailScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const { openModal } = useGlobalBottomSheetModal();

  const product = route.params;

  // 🔥 favorito local
  const [isFavorite, setIsFavorite] = React.useState(false);

  // verificar si ya es favorito
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      // ✅ Verifica el estado cada vez que cambie el usuario o el producto
      const fav = await isProductFavorite(user.uid, product.id);
      setIsFavorite(fav);
    })();
  }, [user, product.id]);

  const handleFavorite = async (value: boolean) => {
    if (!user) {
      Alert.alert(
        "Inicia sesión",
        "Necesitas iniciar sesión para usar favoritos."
      );
      navigation.navigate("authLogin");
      return;
    }

    try {
      // ⚠️ LÓGICA CORREGIDA (INVERTIDA por fallo del componente FavoriteButton):
      // Si el botón devuelve 'false', el usuario quiere AGREGAR (corazón lleno).
      if (value === false) {
        await addFavorite(user.uid, product);
        Alert.alert("Favoritos", "Producto agregado ❤️");
        // Establecer el estado local correctamente
        setIsFavorite(true);
      } else {
        // Si el botón devuelve 'true', el usuario quiere REMOVER (corazón vacío).
        await removeFavorite(user.uid, product.id);
        Alert.alert("Favoritos", "Producto eliminado 💔");
        // Establecer el estado local correctamente
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  const options = [
    { label: " 2kg", value: "2" },
    { label: " 5kg", value: "5" },
    { label: " 10kg", value: "10" },
  ];

  const images =
    product.imgs && product.imgs.length > 0 // ⬅️ CORRECCIÓN: Se comprueba que 'product.imgs' no sea undefined
      ? product.imgs.map((img, index) => ({ id: index, source: { uri: img } }))
      : [
          {
            id: 1,
            source: { uri: "https://b2bmart.vn/images/placeholder.jpg" },
          },
        ];

  const handleScoreChange = React.useCallback((score: number) => {
    console.log("Nuevo puntaje:", score);
  }, []);

  const handleRateProduct = React.useCallback(() => {
    openModal(
      <RateProduct onChangeScore={(score) => handleScoreChange(score)} />
    );
  }, [openModal, handleScoreChange]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageCarousel
          images={images}
          height={320}
          indicatorActiveColor={theme.primary}
          borderRadiusTop={0}
          indicatorSize={10}
        />

        {/* Título */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: 8 }}
        >
          <Label size="3xl" weight="bold">
            {product.name}
          </Label>
          <Label color="gray">{product.author?.name}</Label>

          <Layout
            direction="row"
            alignVertical="space-between"
            alignHorizontal="center"
            fullWidth
          >
            <PressableLayout
              onPress={() => handleRateProduct()}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
                <Star size={iconography.sm} fill="#F5A623" stroke="#F5A623" />
                <Label weight="semibold">4.8</Label>
                <Label size="sm">(132 valoraciones)</Label>
              </Layout>
            </PressableLayout>

            <Label size="3xl" weight="bold">
              ${product.price}
            </Label>
          </Layout>
        </Layout>

        <Divider
          style={{ paddingHorizontal: spacing.lg }}
          margin={spacing.lg}
        />

        {/* Selector */}
        <Layout paddingHorizontal={spacing.md} gap={spacing.sm}>
          <Label weight="semibold"> Tamaño disponible</Label>
          <Segment
            options={options}
            defaultValue="5"
            onChange={(value) => console.log("Seleccionado:", value)}
            borderRadius={8}
            containerStyle={{ width: "100%" }}
          />
        </Layout>

        {/* Descripción */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Descripción</Label>
          <Label align="justify" color="gray" paragraph>
            {product.description}
          </Label>
        </Layout>

        {/* Ubicación */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Ubicación del vendedor</Label>

          {product.coords?.lat && product.coords?.lng ? (
            <SellerMap
              lat={product.coords.lat}
              lng={product.coords.lng}
              height={(width - 32) * 0.75}
              radius={12}
            />
          ) : (
            <View
              style={{
                height: (width - 32) * 0.75,
                borderRadius: 12,
                backgroundColor: isDark ? theme.outline : "#eee",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Label color="gray">Ubicación no disponible</Label>
            </View>
          )}

          <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
            <MapPin size={iconography.sm} color={theme.primary} />
            <Layout gap={spacing.xs}>
              <Label weight="semibold">
                {product.author?.name ?? "Vendedor"}
              </Label>
              <Label size="sm">
                {product.location && product.location.trim() !== ""
                  ? product.location
                  : product.coords?.lat
                  ? `Lat: ${product.coords.lat.toFixed(
                      5
                    )}, Lng: ${product.coords.lng.toFixed(5)}`
                  : "Ubicación no disponible"}
              </Label>
            </Layout>
          </Layout>
        </Layout>

        <Divider
          style={{ paddingHorizontal: spacing.lg }}
          margin={spacing.lg}
        />

        {/* Reseñas */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ paddingBottom: 100 }}
        >
          <Layout
            direction="row"
            alignVertical="space-between"
            alignHorizontal="center"
            fullWidth
          >
            <Label size="xl" weight="bold">
              Reseñas de usuarios
            </Label>
            <Label color={theme.primary}>Ver todas</Label>
          </Layout>

          <Layout>
            <View
              style={[
                styles.reviewCard,
                {
                  backgroundColor: isDark ? theme.outline : theme.background,
                  gap: 8,
                },
              ]}
            >
              <Layout
                direction="row"
                alignVertical="space-between"
                alignHorizontal="center"
              >
                <Label weight="semibold">Laura G.</Label>
                <Layout direction="row" gap={2}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F5A623" stroke="#F5A623" />
                  ))}
                </Layout>
              </Layout>
              <Label size="md" weight="extralight">
                ¡A mi perro le encanta!
              </Label>
            </View>
          </Layout>
        </Layout>
      </ScrollView>

      {/*Bottom Bar */}
      {user && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: isDark ? theme.surface : theme.background,
              borderTopColor: theme.outline,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
            },
          ]}
        >
          <FavoriteButton
            key={`favorite-${product.id}-${isFavorite}`} // ✅ Mantenida para la persistencia.
            defaultValue={isFavorite}
            onPress={(value) => handleFavorite(value)}
          />

          <IconButton icon="MapPin" variant="outline" shape="rounded" />

          <View style={{ flex: 1 }}>
            <Button title="Contactar" onPress={() => {}} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: "auto",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
});
