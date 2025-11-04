// src/screens/tabs/FavoritesScreen.tsx
import React, { useState } from "react";
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

const COLORS = {
  primary: "#13ec6d",
  text: "#111814",
  secondary: "#618972",
  card: "#fff",
  border: "#f0f4f2",
  heart: "#ef4444",
  bg: "#f6f8f7",
};

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

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i))
    );
  };

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("home");
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => toggle(item.id)} style={styles.heartBtn}>
        <Heart
          size={22}
          color={item.liked ? COLORS.heart : COLORS.secondary}
          fill={item.liked ? COLORS.heart : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={EmptyState}
      />
    </View>
  );
}

function EmptyState() {
  return (
    <View style={{ alignItems: "center", marginTop: 48 }}>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 96,
          backgroundColor: "#13ec6d33",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Heart size={40} color={COLORS.primary} />
      </View>
      <Text style={{ fontWeight: "700", color: COLORS.text }}>
        Aún no tienes favoritos
      </Text>
      <Text
        style={{
          marginTop: 6,
          color: COLORS.secondary,
          textAlign: "center",
        }}
      >
        Toca el corazón para guardar productos aquí.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: COLORS.text,
    marginRight: 40,
  },
  listContent: { padding: 16, paddingBottom: 96 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
  },
  img: {
    width: 92,
    height: 92,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#e8e8e8",
  },
  title: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  price: { color: COLORS.primary, fontWeight: "800" },
  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
