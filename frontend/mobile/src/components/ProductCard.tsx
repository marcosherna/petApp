import React from "react";
import { View, Image, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { IconButton } from "./IconButton";
import { Card } from "./Card";
import { Label } from "./Label";
import Score from "./Score";

import { iconography } from "../resourses/iconography";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number | string;
  img?: string;
  score: number;
  style?: StyleProp<ViewStyle>;
  onSelected?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  img = "https://b2bmart.vn/images/placeholder.jpg",
  score,
  style,
  onSelected,
}: ProductCardProps) {
  return (
    <Card style={[styles.card, style]} pressable onPress={onSelected}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: img }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.heartButton}>
            <IconButton
              icon="Heart"
              variant="ghost"
              color="#E4080A"
              colorShape="#E4080A"
              shape="circle"
            />
          </View>
        </View>

        <View style={styles.content}>
          <Label align="center" weight="bold" numberOfLines={2}>
            {name}
          </Label>

          <Score score={score} />

          <View style={styles.footer}>
            <Label weight="bold" size="lg">
              ${price}
            </Label>

            <IconButton
              icon="ShoppingCart"
              size={iconography.sm}
              variant="ghost"
              shape="circle"
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },
  content: {
    padding: 12,
    gap: 8,
    minHeight: 100,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});
