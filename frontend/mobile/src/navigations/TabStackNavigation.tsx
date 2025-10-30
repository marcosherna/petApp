import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, User } from "lucide-react-native";

import { TabStackParamList } from "./params";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";

const Tab = createBottomTabNavigator<TabStackParamList>();

export function TabStackNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
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
