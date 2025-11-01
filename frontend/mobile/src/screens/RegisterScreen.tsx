import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, Input, Label } from "../components";
import { spacing } from "../resourses/spacing";

export default function RegisterScreen() {
  const handleMainAppOnPress = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_content}>
          <Label size="6xl" weight="extrabold">
            Register
          </Label>
          {/* TODO: place appropriate content, such as text or images */}
        </View>

        <View>
          <Input label="Nombre" placeholder="user example" />
          <Input label="Correo" placeholder="example.user@gmail.com" />
          <Input label="Contrasenia" placeholder="********" />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="Registrarse" onPress={() => handleMainAppOnPress()} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  container_inputs: {
    gap: spacing.md,
  },
  container_content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
