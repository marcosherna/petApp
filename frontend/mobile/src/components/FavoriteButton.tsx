import React from "react";

import { IconButton } from "./IconButton";

interface FavoriteButtonProps {
  defaultValue?: boolean;
  onPress?: (isFavorite: boolean) => void;
}

export const FavoriteButton = ({
  defaultValue = false,
  onPress,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = React.useState(defaultValue);

  const handleOnPress = () => {
    setIsFavorite((prev) => !prev);
    onPress?.(isFavorite);
  };

  return (
    <IconButton
      icon="Heart"
      variant="outline"
      color="#E4080A"
      colorShape="#E4080A"
      shape="rounded"
      onPress={() => handleOnPress()}
      fillColor={isFavorite ? "#E4080A" : undefined}
    />
  );
};
