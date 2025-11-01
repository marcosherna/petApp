import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";

export default function App() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <KeyboardProvider>
          <AppStackNavigation />
        </KeyboardProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
