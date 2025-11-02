import { createContext } from "react";
import { User } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  sigIn: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  register: async (name: string, email: string, password: string) => {},
  sigIn: async (email: string, password: string) => {},
});
