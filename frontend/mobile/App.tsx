import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AppStackNavigation />
    </ThemeProvider>
  );
}
