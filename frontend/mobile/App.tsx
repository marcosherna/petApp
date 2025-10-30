import { NavigationContainer } from "@react-navigation/native";

import { MainStackNavigation } from "./src/navigations";

export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigation />;
    </NavigationContainer>
  );
}
