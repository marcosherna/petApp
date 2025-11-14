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
} from "../components";

import { spacing } from "../resourses/spacing";
import { iconography } from "../resourses/iconography";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useProduct } from "../hooks/useProduct";

import { ProductProvider } from "../providers/ProductProvider";
import RateProduct from "./partials/RateProduct";
import {
  CommentList,
  CommentButton,
  BottomSheetComment,
  ViewAllButton,
} from "./partials/CommentProduct";

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

function ProductDetailContent({ navigation, route }: any) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { product, openComment } = useProduct();

  // ---- FAVORITOS ----
  const prod = route?.params ?? product;

  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    if (!user || !prod?.id) return;
    (async () => {
      const fav = await isProductFavorite(user.uid, prod.id);
      setIsFavorite(fav);
    })();
  }, [user, prod?.id]);

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
      if (value === false) {
        await addFavorite(user.uid, prod);
        Alert.alert("Favoritos", "Producto agregado ❤️");
        setIsFavorite(true);
      } else {
        await removeFavorite(user.uid, prod.id);
        Alert.alert("Favoritos", "Producto eliminado 💔");
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  // ---- SELECTOR ----
  const options = [
    { label: " 2kg", value: "2" },
    { label: " 5kg", value: "5" },
    { label: " 10kg", value: "10" },
  ];

  const images =
    prod?.imgs && prod.imgs.length > 0
      ? prod.imgs.map((img: any, index: any) => ({
          id: index,
          source: { uri: img },
        }))
      : [
          {
            id: 1,
            source: { uri: "https://b2bmart.vn/images/placeholder.jpg" },
          },
        ];

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
            {prod?.name}
          </Label>
          <Label color="gray">{prod?.author?.name}</Label>

          <Layout
            direction="row"
            alignVertical="space-between"
            alignHorizontal="center"
            fullWidth
          >
            <RateProduct />
            <Label size="3xl" weight="bold">
              ${prod?.price}
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
            {prod?.description}
          </Label>
        </Layout>

        {/* Ubicación */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Ubicación del vendedor</Label>

          {prod?.coords?.lat && prod.coords?.lng ? (
            <SellerMap
              lat={prod.coords.lat}
              lng={prod.coords.lng}
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
                {prod?.author?.name ?? "Vendedor"}
              </Label>
              <Label size="sm">
                {prod?.location && prod.location.trim() !== ""
                  ? prod.location
                  : prod?.coords?.lat
                  ? `Lat: ${prod.coords.lat.toFixed(
                      5
                    )}, Lng: ${prod.coords.lng.toFixed(5)}`
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
            <ViewAllButton />
          </Layout>

          {/* TU CARD DE RATING + los comentarios de tu compañero */}
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

            {/* Comentarios de tu compañero */}
            <CommentList maxFields={1} />
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
            key={`favorite-${prod.id}-${isFavorite}`}
            defaultValue={isFavorite}
            onPress={(value) => handleFavorite(value)}
          />

          <IconButton icon="MapPin" variant="outline" shape="rounded" />

          <CommentButton />

          <View style={{ flex: 1 }}>
            <Button title="Contactar" onPress={() => {}} />
          </View>
        </View>
      )}

      <BottomSheetComment />
    </SafeAreaView>
  );
}

export default function ProductDetailScreen({
  navigation,
  route,
}: ProductDetailScreenProps) {
  const product = route.params;

  return (
    <ProductProvider initialProduct={product}>
      <ProductDetailContent navigation={navigation} route={route} />
    </ProductProvider>
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
