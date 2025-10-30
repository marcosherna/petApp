import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainStackNavigation } from "./src/navigations";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <MainStackNavigation />;
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
