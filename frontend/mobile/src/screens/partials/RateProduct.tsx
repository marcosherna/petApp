import React, { useMemo } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { View, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";

import { Button, Label } from "../../components";
import { Layout, Score, GestureLayout } from "../../components/ui";
import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";

import { useAuth } from "../../hooks/useAuth";
import { useProduct } from "../../hooks/useProduct";
import { useGlobalBottomSheetModal } from "../../hooks/useGlobalBottomSheetModal";

import UserNotSigIn from "./UserNotSigIn";
import { rateProduct } from "../../network/services";
import { getUserRating } from "../../network/services/authService";

interface RateProps {
  defaultValue?: number;
  onChangeScore?: (score: number) => void;
  onScore?: (score: number) => void;
}

const Rate = ({ defaultValue = 0, onChangeScore, onScore }: RateProps) => {
  const [score, setScore] = React.useState(defaultValue);

  const handleRate = (value: number) => {
    setScore(value);
    onChangeScore?.(value);
  };

  const handleSave = () => {
    onScore?.(score);
  };

  return (
    <BottomSheetView>
      <View style={styles.container}>
        <Score
          score={score}
          size={30}
          disabled={false}
          onChange={handleRate}
          style={{ gap: spacing.md, justifyContent: "center" }}
        />

        <Button title="Guardar" variant="outline" onPress={handleSave} />
      </View>
    </BottomSheetView>
  );
};

const StarIcon = ({ rate = 0 }: { rate?: number }) => {
  const fillRate = useMemo(
    () => (rate === 0 ? undefined : { fill: "#F5A623" }),
    [rate]
  );

  return <Star size={iconography.sm} {...fillRate} stroke="#F5A623" />;
};

export default function RateProduct() {
  const { openModal, closeModal } = useGlobalBottomSheetModal();
  const { user } = useAuth();
  const { product } = useProduct();

  const [userRate, setUserRate] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleScore = React.useCallback(
    async (score: number) => {
      try {
        closeModal();
        await rateProduct(user?.uid!, product?.id!, score);
        setUserRate(score);
      } catch (error) {
        console.log(error);
      }
    },
    [user, product, closeModal]
  );

  React.useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !product) return;
      setLoading(true);
      try {
        const rate = await getUserRating(user.uid, product.id);
        setUserRate(rate);
      } catch (err) {
        console.error("Error al obtener rating:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRating();
  }, [user, product]);

  const handleRateProduct = React.useCallback(() => {
    if (!user) {
      openModal(
        <BottomSheetView>
          <UserNotSigIn onClose={closeModal} />
        </BottomSheetView>
      );
      return;
    }

    openModal(<Rate defaultValue={userRate ?? 0} onScore={handleScore} />);
  }, [user, userRate, handleScore, openModal, closeModal]);

  return (
    <GestureLayout
      onPress={handleRateProduct}
      style={styles.pressable_container}
      disabled={loading}
    >
      <Layout direction="row" gap={spacing.sm} alignHorizontal="center">
        <StarIcon rate={userRate ?? 0} />
        <Label weight="semibold">
          {product?.score?.avg !== undefined
            ? product.score.avg.toFixed(1)
            : "-"}
        </Label>
        <Label size="sm">{`(${product?.score?.count} valoraciones)`}</Label>
      </Layout>
    </GestureLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  pressable_container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
