import { NavigatorScreenParams } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type AuthStackParamList = {
  register: undefined;
  login: undefined;
};

export type RootStackParamList = {
  wellcome: undefined;
  auth: NavigatorScreenParams<AuthStackParamList>;
  mainApp: undefined;
};

export type TabStackParamList = {
  home: undefined;
  profile: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type wellcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "wellcome"
>;

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "login"
>;

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "register"
>;

export type AuthStackScreenProps =
  NativeStackNavigationProp<AuthStackParamList>;
