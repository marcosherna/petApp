import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStackNavigation } from "./src/navigations/AppStackNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <AppStackNavigation />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
