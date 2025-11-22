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

// IMPORTAMOS EL MODAL DE IA
/*import { AIModal } from "../../components/ia/AIModal";*/

export default function HomeScreen() {
  const [category, setCategory] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState(null);

  // CONTROL DEL MODAL IA
  const [showAIModal, setShowAIModal] = React.useState(false);

  const navigation = useNavigation<RootStackNavigation>();

  React.useEffect(() => {
    let unsubscribe: () => void;
    if (category && category !== "") {
      unsubscribe = subscribeToProductsWithFilter(
        [["category", "==", `${category}`]],
        (products) => setProducts(products),
        setError
      );
    } else {
      unsubscribe = subscribeToProducts(setProducts, setError);
    }
    return () => unsubscribe();
  }, [category]);

  const handleSelectCategory = (category: CategoryOptions | null) => {
    if (category) setCategory(category.name);
    else setCategory("");
  };

  const handleSelectedProduct = (product: Product) => {
    navigation.navigate("productDetail", product);
  };

  const renderHeader = () => (
    <View style={styles.header_container}>
      {/* --- BUSCADOR CON BOTÓN DE IA ARRIBA --- */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <SearchBar placeholder="Buscar comida, juguetes y más..." />

        {/* BOTÓN DE IA */}
        <IconButton
          icon="Sparkles"
          size={28}
          variant="ghost"
          shape="circle"
          color="#4a90e2"
          colorShape="#4a90e2"
          onPress={() => setShowAIModal(true)}
        />
      </View>

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
            onPress={() => handleSelectCategory(null)}
          />
        )}
      </Layout>
    </View>
  );

  return (
    <>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.name}
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

      {/* MODAL DE IA */}
      {/* <AIModal visible={showAIModal} onClose={() => setShowAIModal(false)} /> */}
    </>
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
