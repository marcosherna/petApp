import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Package, User } from "lucide-react-native";

import { TabStackParamList } from "./params";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";
import { HeaderLogo } from "../components";
import { SettingsButton } from "../components/partials";
import AddProductoScreen from "../screens/tabs/AddProductoScreen";

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
      <Tab.Screen
        name="addProducto"
        component={AddProductoScreen}
        options={{
          title: "Agregar Producto",
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
