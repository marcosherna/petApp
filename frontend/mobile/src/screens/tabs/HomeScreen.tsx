import { View } from "react-native";

import { Button, IconButton, Label } from "../../components";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const { isDark, setMode } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Label size="4xl">Home Screen</Label>

      <Button
        title={isDark ? "light" : "dark"}
        onPress={() => setMode(isDark ? "light" : "dark")}
      />

      <Label size="lg">Icon button</Label>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <IconButton
          icon="Sun"
          variant="contained"
          onPress={() => console.log("Light")}
        />
        <IconButton
          icon="Moon"
          variant="outline"
          onPress={() => console.log("Dark")}
        />
        <IconButton
          icon="Heart"
          variant="ghost"
          color="#E4080A"
          colorShape="#E4080A"
          shape="circle"
        />
      </View>

      <Label size="lg" align="center" paragraph color="gray">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut, ex!
        Explicabo nam, eligendi praesentium amet rem corrupti. Libero corrupti
        aliquid eius laborum, voluptatem ducimus hic eligendi voluptatibus.
        Ullam, sed unde.
      </Label>
    </View>
  );
}
