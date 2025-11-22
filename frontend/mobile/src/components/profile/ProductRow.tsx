import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Label, IconButton } from "../../components";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";
import { RootStackNavigation } from "../../navigations/params";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../network/firebase";
import { Pencil, Trash } from "lucide-react-native";

interface Props {
  item: {
    id: string;
    name: string;
    price: number;
    imgCover?: string;
  };
  showActions?: boolean;
  onDelete?: (id: string, name?: string) => void;
  onEdit?: (id: string) => void;
}

export function ProductRow({ item, showActions, onDelete, onEdit  }: Props) {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();

  const openDetail = async () => {
    if (showActions) return;
    try {
      const snap = await getDoc(doc(db, "products", item.id));
      if (!snap.exists()) return;
      navigation.navigate("productDetail", {
        id: snap.id,
        ...snap.data(),
      } as any);
    } catch {
      /** manejar error visual */
    }
  };

  return (
    <TouchableOpacity
      onPress={openDetail}
      style={[styles.row, { backgroundColor: theme.surface }]}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imgCover || "https://via.placeholder.com/80" }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Label weight="semibold" numberOfLines={1}>
          {item.name}
        </Label>
        <Label weight="bold" color={theme.primary}>
          ${item.price}
        </Label>
      </View>

      {showActions && (//aqui modificar
        <View style={styles.actions}>
          {/* EDITAR */}
          <TouchableOpacity onPress={() => onEdit?.(item.id)}>
            <Pencil size={20} color={theme.primary} />
          </TouchableOpacity>

          {/* ELIMINAR */}
          <TouchableOpacity
            onPress={() => onDelete?.(item.id, item.name)}
            style={{ marginLeft: spacing.md }}
          >
            <Trash size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  price: {
    marginTop: 2,
    fontWeight: "bold",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
