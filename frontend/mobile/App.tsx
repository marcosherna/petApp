import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";
import { AuthProvider } from "./src/providers/AuthProvider";

export default function App() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AuthProvider>
          <KeyboardProvider>
            <SafeAreaProvider>
              <AppStackNavigation />
            </SafeAreaProvider>
          </KeyboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
