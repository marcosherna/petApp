import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Home, User, Heart, Package } from "lucide-react-native";

import { TabStackParamList } from "./params";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";

import FavoritesScreen from "../screens/tabs/FavoritesScreen";

import { HeaderLogo } from "../components";

import AddProductoScreen from "../screens/tabs/AddProductoScreen";
import UserProfileInfo from "../screens/partials/UserProfileInfo";

const Tab = createBottomTabNavigator<TabStackParamList>();

export function TabStackNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerLeft: () => <HeaderLogo />,
          headerRight: () => <UserProfileInfo />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

    </Tab.Navigator>
  );
}
