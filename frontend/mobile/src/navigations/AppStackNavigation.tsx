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
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

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
        <Stack.Navigator
          screenOptions={() => ({
            title: "",
            headerShown: true,
            headerTransparent: true,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "transparent",
            },
          })}
        >
          <Stack.Screen
            name="wellcome"
            component={WellcomeScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="auth" component={AuthStackNavigation} /> */}
          <Stack.Screen
            name="mainApp"
            component={TabStackNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="authLogin" component={LoginScreen} />
          <Stack.Screen name="authRegister" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
