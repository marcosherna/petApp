import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStackNavigation } from "./src/navigations/AppStackNavigation";
import { ThemeProvider } from "./src/providers/themeProvider";
import { AuthProvider } from "./src/providers/AuthProvider";

import SplashScreenUI from "./src/screens/SplashScreen";

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function loadResources() {
      // Aquí puedes cargar cosas reales: Firebase, fuentes, configs…
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s de carga simulada
      setAppReady(true);
    }
    loadResources();
  }, []);
  
  // Mientras carga, mostramos la pantalla de splash
  if (!appReady) {
    return <SplashScreenUI />;
  }

  // Cuando esté listo, cargamos la app normal
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
