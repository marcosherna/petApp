import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  IconButton,
  Label,
  SearchBar,
  ProductCard,
  EmptyTemplate,
} from "../../components";
import { spacing } from "../../resourses/spacing";

const categories = [
  {
    id: 1,
    name: "Comida",
    icon: "Salad",
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Juguetes",
    icon: "Shapes",
    color: "#FFB300",
  },
  {
    id: 3,
    name: "Higiene",
    icon: "Bubbles",
    color: "#03A9F4",
  },
  {
    id: 4,
    name: "Salud",
    icon: "HeartPulse",
    color: "#E91E63",
  },
];

const products = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  name: `Nombre del producto - ${index + 1}`,
  img: "https://tse3.mm.bing.net/th/id/OIP.3pOeyUigURQY4TJm7tAFIwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
  score: 2,
  price: 10 * index,
}));

export default function HomeScreen() {
  const handleSelectCategory = (category: { id: number; name: string }) => {
    // TODO: aplicar filtros
  };

  const handleSelectedProduct = (product: any) => {
    // TODO: navegacion hacia el detalle
    console.log(product);
  };

  const renderHeader = () => (
    <View style={styles.header_container}>
      <SearchBar placeholder="Buscar comida, juguetes y más..." />
      <Label weight="bold">Explora por Categoría</Label>
      <View style={styles.categories_container}>
        {categories.map((category, index) => (
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
          img={item.img}
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
