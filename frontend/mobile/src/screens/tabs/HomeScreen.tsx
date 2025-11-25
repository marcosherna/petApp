import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { SearchBar, Layout } from "../../components/ui";
import { IconButton, Label, ProductCard } from "../../components";
import { EmptyTemplate } from "../../components/ui";

import { spacing } from "../../resourses/spacing";

import {
  subscribeToProducts,
  categoriesOptions,
  subscribeToProductsWithFilter,
} from "../../network/services";

import { Product, CategoryOptions } from "../../network/models";
import { iconography } from "../../resourses/iconography";
import { RootStackNavigation } from "../../navigations/params";

export default function HomeScreen() {
  const [category, setCategory] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState("");

  const navigation = useNavigation<RootStackNavigation>();

  // ================== LOAD PRODUCTS ===================
  React.useEffect(() => {
    let unsubscribe;

    if (category) {
      unsubscribe = subscribeToProductsWithFilter(
        [["category", "==", category]],
        setProducts,
        console.error
      );
    } else {
      unsubscribe = subscribeToProducts(setProducts, console.error);
    }

    return () => unsubscribe?.();
  }, [category]);

  // ================== FILTER ===================
  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const text = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(text) ||
      (p.storeName?.toLowerCase?.() ?? "").includes(text)
    );
  });

  // ================== NAVIGATE ===================
  const handleSelectedProduct = (product: Product) => {
    navigation.navigate("productDetail", product);
  };

  // ================== HEADER ===================
  const renderHeader = React.useCallback(() => (
    <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>

      {/* SEARCH BAR */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <SearchBar
          placeholder="Buscar productos o tiendas..."
          value={search}
          onChangeText={setSearch}
        />

        <IconButton
          icon="Sparkles"
          size={28}
          variant="ghost"
          shape="circle"
          color="#4a90e2"
          colorShape="#4a90e2"
        />
      </View>

      {/* CATEGORIES */}
      <Label weight="bold" style={{ marginTop: spacing.lg }}>
        Explora por Categoría
      </Label>

      <View style={styles.categories_container}>
        {categoriesOptions.map((category, index) => (
          <View key={index} style={styles.category}>
            <IconButton
              icon={category.icon as any}
              variant="ghost"
              color={category.color}
              colorShape={category.color}
              shape="circle"
              onPress={() => setCategory(category.name)}
            />
            <Label align="center">{category.name}</Label>
          </View>
        ))}
      </View>

      {/* FILTER TITLE */}
      <Layout
        direction="row"
        alignHorizontal="center"
        alignVertical="space-between"
      >
        <Label
          weight="bold"
          style={{ marginTop: spacing.lg, marginBottom: spacing.md }}
        >
          {category === "" ? "Recomendado para ti" : `Filtrados por ${category}`}
        </Label>

        {category !== "" && (
          <IconButton
            icon="X"
            size={iconography.xs}
            variant="ghost"
            shape="circle"
            onPress={() => setCategory("")}
          />
        )}
      </Layout>
    </View>
  ), [search, category]);

  // ================== RENDER ===================
  return (
    <FlatList
      data={filteredProducts}
      numColumns={2}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="always"
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <ProductCard
          id={item.id}
          name={item.name}
          img={item.imgCover ?? item.imgs?.[0] ?? undefined}
          price={item.price}
          score={item.score?.avg ?? 0}
          style={{ flex: 1, marginBottom: spacing.md }}
          onSelected={() => handleSelectedProduct(item)}
        />
      )}
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={{ paddingBottom: spacing.md }}
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
  categories_container: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  category: {
    gap: spacing.sm,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
