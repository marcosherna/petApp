import { NavigatorScreenParams } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Product } from "../network/models";

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
  productDetail: Product;
  addProducto: { editId?: string } | undefined; // <--- AÑADIDO
  editProducto: Product;
  settingScreen: undefined;
};

export type TabStackParamList = {
  home: undefined;
  profile: undefined;
  favorites: undefined;
  addProducto: { editId?: string } | undefined; // <--- AÑADIDO
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

export type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "productDetail"
>;
