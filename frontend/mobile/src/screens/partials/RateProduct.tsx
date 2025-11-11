import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

import { Button } from "../../components";
import { Score } from "../../components/ui";

import { spacing } from "../../resourses/spacing";

interface RateProductProps {
  defaultValue?: number;
  onChangeScore?: (score: number) => void;
}

const RateProductComponent = ({
  defaultValue = 0,
  onChangeScore,
}: RateProductProps) => {
  const [score, setScore] = React.useState(defaultValue);

  const handleRate = (score: number) => {
    setScore(score);
    onChangeScore?.(score);
  };

  return (
    <BottomSheetView>
      <View style={styles.container}>
        <Score
          score={score}
          size={30}
          disabled={false}
          onChange={(score) => handleRate(score)}
          style={{ gap: spacing.md, justifyContent: "center" }}
        />

        <Button title="Guardar" variant="outline" onPress={() => {}} />
      </View>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});

export const RateProduct = React.memo(RateProductComponent);
