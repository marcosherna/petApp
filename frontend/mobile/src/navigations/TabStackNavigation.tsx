import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, User } from "lucide-react-native";

import { TabStackParamList } from "./params";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";
import { HeaderLogo, IconButton } from "../components";
import { SettingsButton } from "../components/partials";

const Tab = createBottomTabNavigator<TabStackParamList>();

export function TabStackNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerLeft: () => <HeaderLogo />,
          headerRight: () => <SettingsButton />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
