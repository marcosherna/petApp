import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MessageCircle,
  MapPin,
  Send,
} from "lucide-react-native";
import { ProductDetailScreenProps } from "../navigations/params";
import { Divider, ImageCarousel, Layout, Segment } from "../components/ui";
import { Button, IconButton, Label } from "../components";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../resourses/spacing";
import { iconography } from "../resourses/iconography";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({
  navigation,
  route,
}: ProductDetailScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const product = route.params;
  const options = [
    { label: " 2kg", value: "2" },
    { label: " 5kg", value: "5" },
    { label: " 10kg", value: "10" },
  ];

  const images =
    product.imgs.length > 0
      ? product.imgs.map((img, index) => ({
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
      <ScrollView
        style={[styles.container, {}]}
        showsVerticalScrollIndicator={false}
      >
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
            {product.name}
          </Label>
          <Label color="gray">{product.author?.name}</Label>
          <Layout
            direction="row"
            alignVertical="space-between"
            alignHorizontal="center"
            fullWidth
          >
            <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
              <Star size={iconography.sm} fill="#F5A623" stroke="#F5A623" />
              <Label weight="semibold">4.8</Label>
              <Label size="sm">(132 valoraciones)</Label>
            </Layout>

            <Label size="3xl" weight="bold">
              ${product.price}
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
            {product.description}
          </Label>
        </Layout>

        {/* Location */}
        <Layout
          paddingHorizontal={spacing.md}
          gap={spacing.sm}
          style={{ marginTop: spacing.md }}
        >
          <Label weight="semibold">Ubicacion del vendedor</Label>
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB2kWrNsJ9c14_hTT3p6ftKaaVtc66ufl2Nrkg_sRyP4YoFd2rRk8JhUm2MFYCn2CDeEOdzayJAUy2l3p7f0-yAiW3oZB-Bgqw1qnI4TR2-qgT7puxXLzaAmwPpGv35vTLEOKI7Z6ivGiKsl8O4TamVIiL-_8g3M5undVOrSi27nja4y7JynvV--VfS627Pcx1NH0Ht1HZGDZirzr-tOWPBmt_jaifFQrbcIbNyraZ3cGVbCUGdJqBwFi1o3zyn_YUc4t_OSI8j_ig",
            }}
            style={styles.mapImage}
            imageStyle={styles.mapImageStyle}
          />

          <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
            <MapPin size={iconography.sm} color={theme.primary} />
            <Layout gap={spacing.xs}>
              <Label weight="semibold">PetLife Store</Label>
              <Label size="sm">Av. Libertador 1234, Buenos Aires</Label>
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
                ¡A mi perro le encanta! Tiene mucha más energía y su pelo brilla
                como nunca.
              </Label>
            </View>
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
            },
          ]}
        >
          <IconButton
            icon="Heart"
            variant="outline"
            color="#E4080A"
            colorShape="#E4080A"
            shape="rounded"
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
  container: {
    flex: 1,
  },

  mapImage: {
    width: "100%",
    height: (width - 32) * 0.75,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  mapImageStyle: {
    borderRadius: 12,
  },

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
  stars: {
    flexDirection: "row",
    gap: 2,
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
  contactButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#EBF5FF",
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  locationButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    gap: 8,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
