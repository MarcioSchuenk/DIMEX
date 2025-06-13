import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Autologin com cookie
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`);
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    checkLogin();
  }, []);

  const login = async ({ login, password }) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        { login, password },
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      alert(
        "Erro ao fazer login: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/users/logout`, null, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      alert(
        "Erro ao sair: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
