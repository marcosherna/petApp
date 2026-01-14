import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootScreenProps } from "../navigations/params";

import { Button, Label } from "../components";

export default function WellcomeScreen({ navigation }: RootScreenProps) {
  const handleLoginOnPress = () => {
    navigation.navigate("authLogin");
  };

  const handleRegisterOnPress = () => {
    navigation.navigate("authRegister");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_content}>
        <Label size="6xl" weight="bold" align="center">
          Pet App
        </Label>

        <Label
          size="sm"
          color="gray"
          align="center"
          paragraph
          numberOfLines={2}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
          quas ipsa optio explicabo ut? Temporibus rem, corrupti illum tempora
          delectus soluta magni deserunt dicta illo ullam placeat ab quidem
          harum?
        </Label>
      </View>

      <View style={styles.container_buttons}>
        <Button title="Iniciar sesion" onPress={() => handleLoginOnPress()} />
        <Button
          title="Registrase"
          variant="outline"
          onPress={() => handleRegisterOnPress()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "column",
    gap: 8,
    padding: 16,
  },
  container_buttons: {
    gap: 8,
  },
  container_content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 30,
  },
});
