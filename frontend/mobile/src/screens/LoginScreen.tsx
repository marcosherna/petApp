import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Input } from "../components";
import { RootStackNavigation } from "../navigations/params";

export default function LoginScreen() {
  const navigation = useNavigation<RootStackNavigation>();

  const handleMainAppOnPress = () => {
    navigation.navigate("mainApp");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.container_content}>
          <Text style={styles.title}>Login</Text>
          {/* TODO: place appropriate content, such as text or images */}
        </View>

        <View>
          <Input label="Correo" placeholder="example.user@gmail.com" />
          <Input label="Contrasenia" placeholder="********" />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button
            title="Iniciar sesion"
            onPress={() => handleMainAppOnPress()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 16,
  },
  container_inputs: {
    gap: 8,
  },
  container_content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
  },
});
