import { Text, View } from "react-native";

import { Button } from "../../components";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const { theme, isDark, setMode } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>

      <Button
        title={isDark ? "light" : "dark"}
        onPress={() => setMode(isDark ? "light" : "dark")}
      />
    </View>
  );
}
