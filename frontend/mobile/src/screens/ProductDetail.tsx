import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Star, MapPin } from "lucide-react-native";

import { ProductDetailScreenProps } from "../navigations/params";

import { Divider, ImageCarousel, Layout, Segment } from "../components/ui";

import { Button, IconButton, Label, FavoriteButton, Map } from "../components";

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

type SellerMapProps = {
  lat: number;
  lng: number;
  height?: number;
  radius?: number;
};
const SellerMap: React.FC<SellerMapProps> = ({
  lat,
  lng,
  height = 220,
  radius = 12,
}) => {
  const mToProduct = useRef<MapView>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    setTimeout(() => {
      mToProduct.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        800
      );
    }, 300);
  }, [lat, lng]);

  return (
    <View
      style={{
        height,
        borderRadius: radius,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {lat != null && lng != null && (
        <Map
          ref={mToProduct}
          loadingEnabled={true}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: lat, longitude: lng }} />
        </Map>
      )}
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
  // const options = [
  //   { label: " 2kg", value: "2" },
  //   { label: " 5kg", value: "5" },
  //   { label: " 10kg", value: "10" },
  // ];

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
            {/* Vista del nombre de tienda */}
            <View style={{ alignItems: "flex-end" }}>
              <Label size="3xl" weight="bold">
                ${prod?.price}
              </Label>

              {prod?.storeName && (
                <Label
                  size="2xl" // <--- Aumentado a XL (antes era sm)
                  weight="bold" // <--- Letra más gruesa
                  color="gray"
                  style={{ marginTop: 4 }}
                >
                  {prod.storeName}
                </Label>
              )}
            </View>
          </Layout>
        </Layout>

        <Divider
          style={{ paddingHorizontal: spacing.lg }}
          margin={spacing.lg}
        />

        {/* Selector */}
        {/* <Layout paddingHorizontal={spacing.md} gap={spacing.sm}>
          <Label weight="semibold"> Tamaño disponible</Label>
          <Segment
            options={options}
            defaultValue="5"
            onChange={(value) => console.log("Seleccionado:", value)}
            borderRadius={8}
            containerStyle={{ width: "100%" }}
          />
        </Layout> */}

        {/* Descripción */}
        <Layout paddingHorizontal={spacing.md} gap={spacing.sm}>
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
                width: "100%",
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

          <Layout fullWidth>
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

          {/* <IconButton icon="MapPin" variant="outline" shape="rounded" /> */}

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
