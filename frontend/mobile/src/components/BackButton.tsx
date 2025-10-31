import { ChevronLeft } from "lucide-react-native";

import { PressableLayout } from "./PressableLayout";
import { Label } from "./Label";

interface BackButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  colorShape?: string;
}

export function BackButton({
  label,
  onPress,
  color,
  colorShape,
}: BackButtonProps) {
  return (
    <PressableLayout
      onPress={onPress}
      color={colorShape}
      style={{
        flexDirection: "row",
        paddingLeft: 0,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8
      }}
    >
      <ChevronLeft color={color} size={22}></ChevronLeft>
      <Label color={color}>
        {label}
      </Label>
    </PressableLayout>
  );
}
