import React from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { SearchBar, Layout, LoadingTemplate } from "../../components/ui";
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
// IMPORTAMOS EL MODAL DE IA
/*import { AIModal } from "../../components/ia/AIModal";*/

export default function HomeScreen() {
  const [category, setCategory] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState("");
  const [filteredProducts, setFilteredProducts] =
    React.useState<Product[]>(products);
  const [loading, setLoading] = React.useState(true);

  // CONTROL DEL MODAL IA
  const [showAIModal, setShowAIModal] = React.useState(false);

  const navigation = useNavigation<RootStackNavigation>();

  // ================== LOAD PRODUCTS ===================
  React.useEffect(() => {
    setLoading(true);
    let unsubscribe;

    if (category) {
      unsubscribe = subscribeToProductsWithFilter(
        [["category", "==", category]],
        (p) => {
          setProducts(p);
          setFilteredProducts(p);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );
    } else {
      unsubscribe = subscribeToProducts(
        (p) => {
          setProducts(p);
          setFilteredProducts(p);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );
    }

    return () => unsubscribe?.();
  }, [category]);

  // ================== SEARCH ===================
  const handleSubmitSearch = (query: string) => {
    const filltered = products.filter((p) => {
      if (!query.trim()) return true;
      const text = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(text) ||
        (p.storeName?.toLowerCase?.() ?? "").includes(text)
      );
    });
    setFilteredProducts(filltered);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearch("");
    setFilteredProducts(products);
    Keyboard.dismiss();
  };

  // ================== HEADER ===================
  const renderHeader = React.useMemo(
    () => (
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
        {/* SEARCH BAR */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SearchBar
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="Buscar productos o tiendas..."
            onSubmitEditing={(e) => handleSubmitSearch(e.nativeEvent.text)}
            onClear={() => handleClearSearch()}
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
                onPress={() => {
                  setCategory(category.name);
                }}
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
            {category === ""
              ? "Recomendado para ti"
              : `Filtrados por ${category}`}
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
    ),
    [category, search, products]
  );

  // ================== NAVIGATE ===================
  const handleSelectedProduct = (product: Product) => {
    navigation.navigate("productDetail", product);
  };

  // ================== RENDER ===================
  return (
    <FlatList
      data={filteredProducts}
      numColumns={2}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="none"
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
        <>
          {loading ? (
            <LoadingTemplate />
          ) : (
            <EmptyTemplate
              message="No hay productos disponibles"
              subMessage="Intenta con otros filtros o regresa más tarde"
              icon="package"
            />
          )}
        </>
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
