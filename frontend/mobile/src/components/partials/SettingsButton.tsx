import { useAuth } from "../../hooks/useAuth";
import { IconButton } from "../IconButton";

export function SettingsButton() {
  const { onOpenModal } = useAuth();
  return <IconButton icon="Settings" size={22} onPress={() => onOpenModal()} />;
}
