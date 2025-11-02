import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import { UserInfoButtomSheet } from "./src/components/partials";

export default function App() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AuthProvider>
          <KeyboardProvider>
            <AppStackNavigation />
          </KeyboardProvider> 
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
