import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Star } from "lucide-react-native";

import { IconButton } from "./IconButton";

import { Card } from "./Card";
import { Label } from "./Label";
import { iconography } from "../resourses/iconography";
import Score from "./Score";

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  img: string;
  score: number;
  style?: StyleProp<ViewStyle>;
  onSelected?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  img,
  score,
  style,
  onSelected,
}: ProductCardProps) {
  return (
    <Card style={style} pressable onPress={onSelected}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: img,
          }}
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 200,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  rating: {
    flexDirection: "row",
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
