import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { wellcomeScreenProps } from "../navigations/params";

import { Button, Label } from "../components";

export default function WellcomeScreen({ navigation }: wellcomeScreenProps) {
  const handleLoginOnPress = () => {
    navigation.navigate("auth", { screen: "login" });
  };

  const handleRegisterOnPress = () => {
    navigation.navigate("auth", { screen: "register" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_content}>
        <Label size="2xl" weight="bold" align="center">
          Pet App
        </Label>

        <Label size="sm" color="gray" align="center" paragraph>
          Este es un párrafo largo que se ajusta al ancho del dispositivo y
          mantiene buena legibilidad en móviles.
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
