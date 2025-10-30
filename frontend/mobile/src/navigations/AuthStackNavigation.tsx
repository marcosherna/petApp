import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "./params";

import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
