import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ProductRow } from "./ProductRow";
import { EmptyTemplate } from "../../components/ui";
import { spacing } from "../../resourses/spacing";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  data: {
    id: string;
    name: string;
    price: number;
    imgCover?: string;
  }[];
  onDelete: (id: string, name?: string) => void;
  onEdit: (id: string) => void; // 👈 AÑADIR
}

export function ProductList({ data, onDelete, onEdit /* aqui */}: Props) {
  const { theme } = useTheme();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductRow
          item={item}
          showActions
          onDelete={onDelete}
          onEdit={onEdit} // 👈 PASAR
        />
      )}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: theme.outline }]} />
      )}
      ListEmptyComponent={
        <EmptyTemplate
          message="Aún no tienes productos"
          subMessage="Pulsa el botón Nuevo para publicar"
          icon="package"
        />
      }
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginVertical: spacing.xs,
  },
});
