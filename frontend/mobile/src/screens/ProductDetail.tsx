import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapPin } from "lucide-react-native";

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
    if (lat && lng && mToProduct) {
      mToProduct.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        800
      );
    }
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
      <Map
        ref={mToProduct}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
      </Map>
    </View>
  );
};

function ProductDetailContent() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const { product, openComment } = useProduct();

  const options = [
    { label: " 2kg", value: "2" },
    { label: " 5kg", value: "5" },
    { label: " 10kg", value: "10" },
  ];

  const images =
    product && product.imgs.length > 0
      ? product.imgs.map((img, index) => ({ id: index, source: { uri: img } }))
      : [
          {
            id: 1,
            source: { uri: "https://b2bmart.vn/images/placeholder.jpg" },
          },
        ];

  const handleFavorite = (isFavorite: boolean) => {
    console.log(isFavorite);
    // TODO: implement method
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <ImageCarousel
          images={images}
          height={320}
          indicatorActiveColor={theme.primary}
          borderRadiusTop={0}
          indicatorSize={10}
        />

        {/* Title & Price */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: 8 }}
        >
          <Label size="3xl" weight="bold">
            {product?.name}
          </Label>
          <Label color="gray">{product?.author?.name}</Label>

          <Layout
            direction="row"
            alignVertical="space-between"
            alignHorizontal="center"
            fullWidth
          >
            <RateProduct />

            <Label size="3xl" weight="bold">
              ${product?.price}
            </Label>
          </Layout>
        </Layout>

        <Divider
          style={{ paddingHorizontal: spacing.lg }}
          margin={spacing.lg}
        />

        {/* Size Selector */}
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

        {/* Description */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Descripcion</Label>
          <Label align="justify" color="gray" paragraph>
            {product?.description}
          </Label>
        </Layout>

        {/* Location */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Ubicacion del vendedor</Label>

          {product?.coords?.lat && product.coords?.lng ? (
            <SellerMap
              lat={product.coords.lat}
              lng={product.coords.lng}
              height={(width - 32) * 0.75}
              radius={12}
            />
          ) : (
            // Si el producto no tiene coords, no renderizamos mapa
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
                {product?.author?.name ?? "Vendedor"}
              </Label>
              <Label size="sm">
                {product?.location && product?.location.trim() !== ""
                  ? product.location
                  : product?.coords?.lat
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

        {/* Reviews */}
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

      {/* Bottom Bar */}
      {user && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: isDark
                ? `${theme.surface}`
                : `${theme.background}`,
              borderTopColor: theme.outline,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
            },
          ]}
        >
          <FavoriteButton
            defaultValue={false}
            onPress={(isFavorite) => handleFavorite(isFavorite)}
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
      <ProductDetailContent />
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
    backgroundColor: "rgba(248, 249, 250, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    gap: 12,
  },
});
