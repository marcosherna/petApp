import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Heart, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";
import {
  fontSizes,
  fontWeights,
  lineHeights,
} from "../../resourses/typography";
import { iconography } from "../../resourses/iconography";

type Item = {
  id: string;
  title: string;
  price: string;
  image: string;
  liked?: boolean;
};

const SEED: Item[] = [
  {
    id: "1",
    title: "Juguete para Perro Resistente",
    price: "$15.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0X6aRyzJ3PRz4PVLE8Fio7PCGUKcLpRn90Rti0aE7_DvPo5izi38HITFBBd4M6KQOYO5HzPDhIlbDY3w_RtYLdVAG9Va6ye6J6ilpGFMgJW926mqKpnfhDNYLkkZ0tk8CcZ4IuOpYxWxsWFO80tf2icY4Q4mp5wKAGozRtNbRj0zI9OdMhDjW3XY2DivUUeKR3Jf2u2ulss_rNDkoFJcYvxIMG9EYy5o2gry_3_f8rxRvEXhKcgKiSa8kkbDKra_ehs3_sQ54UQjd",
    liked: true,
  },
  {
    id: "2",
    title: "Cama Suave para Gato",
    price: "$29.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVkDSvlDNrn4dg_HI5JidA9rqAX72XujxvaIZTcnW4EHhuS2ULifSEqwPtMfp2a7uNTn-bI5eGOe_c3jMAgnPfsp6lQSKtqZTsXE_Pf7w43mjULbaNuJNaY7LVBxlU92-ZbR3ZZ_UY-18bnDEVtYTZDtqkGii1nWU7ARvGmPX0Etmln2sn4QVfn4BheP7b7d3YzdrnBWD60BwN3FfYjhh3OVcSbNrbLZMRyW2nZ8YsrqwEGLgWDTXJ4NNAwHsxlO5Q4ZFoVjNq-QXR",
    liked: true,
  },
  {
    id: "3",
    title: "Collar de Cuero Premium",
    price: "$22.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBppCy75MpP6pDgH2IpUANbZhFM1WU-M3aDLroRaThQgEyoqvC3pw1vz1-ofpNf1y7AFIJzsJ-_yThN7BbbQxtFhm3AcRm-Qpnn0Z0C1xb-x-hKaU3tLxXL-q7ELtmXcfOfjBrM1pFA3n0e_RD2GqYtpAnr5J0hlloR0iwUAhe6ZxGJN4uXBctSk7d_6lMz2sBNP68gE-fDEdlxPJpIOLUkRMZFe8qMqGw3w0zKP64IIXz-wuSB32UyZJZgspsDvbEGUu1l_08Zau4r",
    liked: true,
  },
];

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<Item[]>(SEED);
  const { theme } = useTheme();

  const styles = createStyles(theme);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Mis Favoritos",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate("home")
          }
          style={styles.headerButton}
        >
          <ArrowLeft size={iconography.sm} color={theme.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, styles]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i))
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => toggle(item.id)} style={styles.heartBtn}>
        <Heart
          size={iconography.sm}
          color={item.liked ? theme.accent : theme.secondaryText}
          fill={item.liked ? theme.accent : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safe}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={() => <EmptyState theme={theme} />}
      />
    </View>
  );
}

function EmptyState({ theme }: { theme: any }) {
  const emptyStyles = createEmptyStateStyles(theme);

  return (
    <View style={emptyStyles.container}>
      <View style={emptyStyles.iconContainer}>
        <Heart size={iconography.xl} color={theme.primary} />
      </View>
      <Text style={emptyStyles.title}>Aún no tienes favoritos</Text>
      <Text style={emptyStyles.subtitle}>
        Toca el corazón para guardar productos aquí.
      </Text>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl * 3,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: theme.outline,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      marginBottom: spacing.sm,
    },
    img: {
      width: spacing.xl * 3,
      height: spacing.xl * 3,
      borderRadius: spacing.sm,
      marginRight: spacing.sm,
      backgroundColor: "#e8e8e8",
    },
    cardContent: {
      flex: 1,
    },
    title: {
      color: theme.text,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.md,
      marginBottom: spacing.xs,
    },
    price: {
      color: theme.primary,
      fontWeight: fontWeights.extrabold,
      fontSize: fontSizes.sm,
    },
    heartBtn: {
      width: iconography.xl,
      height: iconography.xl,
      borderRadius: iconography.xl / 2,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: spacing.sm,
    },
    headerButton: {
      marginLeft: spacing.sm,
    },
  });

const createEmptyStateStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: spacing.xl + spacing.md,
      paddingHorizontal: spacing.md,
    },
    iconContainer: {
      width: spacing.xl * 3,
      height: spacing.xl * 3,
      borderRadius: spacing.xl * 1.5,
      backgroundColor: `${theme.primary}33`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.sm,
    },
    title: {
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      color: theme.secondaryText,
      textAlign: "center",
    },
  });
