import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WellcomeScreen from "../screens/WellcomeScreen";

import { RootStackParamList } from "./params";
import { AuthStackNavigation } from "./AuthStackNavigation";
import { TabStackNavigation } from "./TabStackNavigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="wellcome" component={WellcomeScreen} />
      <Stack.Screen name="auth" component={AuthStackNavigation} />
      <Stack.Screen name="mainApp" component={TabStackNavigation} />
    </Stack.Navigator>
  );
}
