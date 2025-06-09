import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Ao iniciar, tenta carregar o usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async ({ login, password }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        login,
        password,
      });

      const { accessToken, user } = response.data;

      // Salva o token e o usuário localmente
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/");
    } catch (error) {
      alert(
        "Erro ao fazer login: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);