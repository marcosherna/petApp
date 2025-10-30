import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components";
import { RootStackNavigation } from "../navigations/params";

export default function RegisterScreen() {
  const navigation = useNavigation<RootStackNavigation>();

  const handleMainAppOnPress = () => {
    navigation.navigate("mainApp");
  };

  return (
    <View>
      <Text>register</Text>
      <Button title="Registrar" onPress={() => handleMainAppOnPress()} />
    </View>
  );
}
