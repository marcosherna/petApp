import React, { memo, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Star } from "lucide-react-native"; 

interface ScoreProps {
  score: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  maxStars?: number;
  style?: object;
}

const Score: React.FC<ScoreProps> = ({
  score,
  size = 20,
  filledColor = "#f7e51cff",
  emptyColor = "#555",
  maxStars = 5,
  style,
}) => {
  const stars = useMemo(() => {
    const clampedScore = Math.max(0, Math.min(score, maxStars));
    return Array.from({ length: maxStars }, (_, i) => i < clampedScore);
  }, [score, maxStars]);

  const fill = filledColor;
  const empty = emptyColor;

  return (
    <View style={[styles.container, style]}>
      {stars.map((isFilled, index) => (
        <Star
          key={index}
          size={size}
          color={isFilled ? fill : empty}
          fill={isFilled ? fill : "transparent"}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default memo(Score);
