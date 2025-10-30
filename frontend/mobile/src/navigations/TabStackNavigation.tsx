import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
