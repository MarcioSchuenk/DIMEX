import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase.config";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // garante que app só renderize depois do Firebase verificar

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const expiresAt = localStorage.getItem("expiresAt");

      if (firebaseUser && expiresAt) {
        const now = new Date();
        const expiresDate = new Date(expiresAt);

        if (now < expiresDate) {
          setUser(firebaseUser);
        } else {
          logout();
        }
      } else {
        setUser(null);
      }

      setLoading(false); // fim da checagem
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ login, password }) => {
    try {
      await setPersistence(auth, browserLocalPersistence); // mantém sessão mesmo com F5 ou fechamento

      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        login,
        password
      );

      // Sessão válida por 7 dias
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      localStorage.setItem("expiresAt", expiresAt.toISOString());

      setUser(firebaseUser);
      navigate("/");
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("expiresAt");
    navigate("/login");
  };

  if (loading) return null; // ou um spinner de carregamento

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
