import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { IconButton, Label, SearchBar, ProductCard } from "../../components";

import { EmptyTemplate } from "../../components/ui";

import { spacing } from "../../resourses/spacing";

import { subscribeToProducts, categoriesOptions } from "../../network/services";
import { Product, CategoryOptions } from "../../network/models";

export default function HomeScreen() {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (products) => {
        setProducts(products);
      },
      (err) => setError(err)
    );

    return () => unsubscribe();
  }, []);

  const handleSelectCategory = (category: CategoryOptions) => {
    // TODO: aplicar filtros
  };

  const handleSelectedProduct = (product: Product) => {
    console.log(product);
  };

  const renderHeader = () => (
    <View style={styles.header_container}>
      <SearchBar placeholder="Buscar comida, juguetes y más..." />
      <Label weight="bold">Explora por Categoría</Label>
      <View style={styles.categories_container}>
        {categoriesOptions.map((category, index) => (
          <View key={index} style={styles.category}>
            <IconButton
              icon={category.icon as any}
              variant="ghost"
              color={category.color}
              colorShape={category.color}
              shape="circle"
              onPress={() => handleSelectCategory(category)}
            />
            <Label align="center">{category.name}</Label>
          </View>
        ))}
      </View>

      <Label
        weight="bold"
        style={{ marginTop: spacing.lg, marginBottom: spacing.md }}
      >
        Recomendado para ti
      </Label>
    </View>
  );

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <ProductCard
          id={item.id}
          name={item.name}
          img={item.imgCover}
          price={item.price}
          score={item.score}
          style={{ flex: 1, marginBottom: spacing.md }}
          onSelected={() => handleSelectedProduct(item)}
        />
      )}
      ListHeaderComponent={renderHeader}
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={{ padding: spacing.md }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyTemplate
          message="No hay productos disponibles"
          subMessage="Intenta con otros filtros o regresa más tarde"
          icon="package"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  header_container: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  categories_container: {
    flexDirection: "row",
  },
  category: {
    gap: spacing.sm,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
