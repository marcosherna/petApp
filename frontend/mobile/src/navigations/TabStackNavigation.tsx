import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, User } from "lucide-react-native";

import { TabStackParamList } from "./params";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";

import { HeaderLogo } from "../components";
import UserProfileInfo from "../screens/partials/UserProfileInfo";

import React from "react";
import { View } from "react-native";

import { AIBrainButton } from "../components/AIBrainButton";
import { AIModal } from "../components/ia/AIModal";

const Tab = createBottomTabNavigator<TabStackParamList>();

export function TabStackNavigation() {
  const [showAIModal, setShowAIModal] = React.useState(false);

  return (
    <>
      <AIModal visible={showAIModal} onClose={() => setShowAIModal(false)} />

      <Tab.Navigator>
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: "",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            headerLeft: () => <HeaderLogo />,

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Botón IA */}
                <AIBrainButton onPress={() => setShowAIModal(true)} />

                {/* Botón engranaje */}
                <UserProfileInfo />
              </View>
            ),
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
    </>
  );
}
