import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";

export default function App() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AppStackNavigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
