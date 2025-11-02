import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";

import {
  unsubscribeSession,
  signOut,
  sigIn as signInUser,
  register as registerUser,
} from "../network/services/authService";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = unsubscribeSession((userSession) => {
      setUser(userSession);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
  };

  const sigIn = async (email: string, password: string) => {
    await signInUser(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, register, sigIn }}>
      {children}
    </AuthContext.Provider>
  );
};
