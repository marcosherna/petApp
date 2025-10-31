import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";

import WellcomeScreen from "../screens/WellcomeScreen";

import { RootStackParamList } from "./params";
import { AuthStackNavigation } from "./AuthStackNavigation";
import { TabStackNavigation } from "./TabStackNavigation";
import { useTheme } from "../hooks/useTheme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStackNavigation() {
  const { theme, isDark } = useTheme();

  const navTheme: NavigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.outline,
      notification: theme.accent,
    },
    fonts: isDark ? DarkTheme.fonts : DefaultTheme.fonts,
  };

  return (
    <>
      <StatusBar
        animated
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.surface}
      />

      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="wellcome" component={WellcomeScreen} />
          <Stack.Screen name="auth" component={AuthStackNavigation} />
          <Stack.Screen name="mainApp" component={TabStackNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
