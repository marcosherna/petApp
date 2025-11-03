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
  // auth: NavigatorScreenParams<AuthStackParamList>;
  mainApp: undefined;
  authLogin: undefined;
  authRegister: undefined;
};

export type TabStackParamList = {
  home: undefined;
  profile: undefined;
  addProducto: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type RootScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "wellcome"
>;

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "login"
>;

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "authRegister"
>;

export type AuthStackScreenProps =
  NativeStackNavigationProp<AuthStackParamList>;
