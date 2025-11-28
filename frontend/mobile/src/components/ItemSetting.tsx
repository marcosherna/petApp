import { TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { Layout } from "./ui";

import { useTheme } from "../hooks/useTheme";
import { spacing } from "../resourses/spacing";

export const ItemSetting = ({
  children,
  onPress,
}: {
  children?: React.ReactNode;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Layout
        direction="row"
        alignHorizontal="center"
        alignVertical="space-between"
        fullWidth
      >
        <Layout
          direction="row"
          gap={spacing.md}
          alignHorizontal="center"
          alignVertical="center"
        >
          {children}
        </Layout>

        <ChevronRight color={theme.secondaryText} />
      </Layout>
    </TouchableOpacity>
  );
};