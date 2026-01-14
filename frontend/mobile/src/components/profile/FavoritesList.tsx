import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ProductRow } from "./ProductRow";
import { EmptyTemplate } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";

interface Props {
  data: {
    id: string;
    name: string;
    price: number;
    imgCover?: string;
  }[];
}

export function FavoritesList({ data }: Props) {
  const { theme } = useTheme();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductRow item={item} showActions={false} />}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: theme.outline }]} />
      )}
      ListEmptyComponent={
        <EmptyTemplate
          message="Sin favoritos"
          subMessage="Marca productos con ❤️ para verlos aquí"
          icon="heart"
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
