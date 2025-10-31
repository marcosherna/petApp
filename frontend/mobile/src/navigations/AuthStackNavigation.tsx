import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "./params";

import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { BackButton } from "../components";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }: { navigation: any }) => ({
        headerLeft: ({
          tintColor,
          label,
        }: {
          tintColor?: string;
          label?: string;
        }) =>
          navigation.canGoBack() ? (
            <BackButton
              color={tintColor}
              label={label ?? "back"}
              onPress={() => navigation.goBack()}
            />
          ) : null,
      })}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
