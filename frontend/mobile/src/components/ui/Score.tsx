import React, { memo, useMemo, useCallback } from "react";
import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import { Star } from "lucide-react-native";

interface ScoreProps {
  score: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  maxStars?: number;
  style?: ViewStyle;
  disabled?: boolean;
  onChange?: (newScore: number) => void;
}

const Score: React.FC<ScoreProps> = ({
  score,
  size = 20,
  filledColor = "#f7e51cff",
  emptyColor = "#555",
  maxStars = 5,
  style,
  disabled = true,
  onChange,
}) => {
  const stars = useMemo(() => {
    const clampedScore = Math.max(0, Math.min(score, maxStars));
    return Array.from({ length: maxStars }, (_, i) => i < clampedScore);
  }, [score, maxStars]);

  const handlePress = useCallback(
    (index: number) => {
      if (!disabled && onChange) {
        onChange(index + 1);
      }
    },
    [disabled, onChange]
  );

  return (
    <View style={[styles.container, style]}>
      {stars.map((isFilled, index) => {
        const color = isFilled ? filledColor : emptyColor;
        const fill = isFilled ? filledColor : "transparent";

        if (disabled) {
          return <Star key={index} size={size} color={color} fill={fill} />;
        }

        return (
          <Pressable key={index} onPress={() => handlePress(index)}>
            <Star size={size} color={color} fill={fill} />
          </Pressable>
        );
      })}
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
