import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const user = await AsyncStorage.getItem("user");
      if (token && user) {
        setAuth({ accessToken: token, user: JSON.parse(user) });
      }
    };
    loadAuth();
  }, []);

  const login = async (login, password) => {
    try {
      const response = await api.post("/users/login/", {
        login,
        password,
      });

      const { accessToken, user } = response.data;

      const userData = {
        id: user.id,
        name: user.login,
        role: user.role,
        token: accessToken,
      };

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setAuth({ accessToken, user: userData });
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
