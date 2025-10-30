import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components";
import { RootStackNavigation } from "../navigations";

export default function RegisterScreen() {
  const navigation = useNavigation<RootStackNavigation>();

  const handleMainAppOnPress = () => {
    navigation.navigate("home");
  };

  return (
    <View>
      <Text>Login</Text>
      <Button title="Registrar" onPress={() => handleMainAppOnPress()} />
    </View>
  );
}
