import { createContext, useContext, useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { set } from "zod";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const expiresAt = localStorage.getItem("expiresAt");

      if (firebaseUser && expiresAt) {
        const now = new Date();
        const expiresDate = new Date(expiresAt);

        if (now < expiresDate) {
          setUser(firebaseUser);

          try {
            const userDc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDc.exists()) {
              const data = userDc.data();
              setRole(data.role);
            } else {
              setRole("user");
            }
          } catch (error) {
            console.error("Erro ao buscar role:", error);
          }
        } else {
          logout();
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ login, password }) => {
    try {
      await setPersistence(auth, browserLocalPersistence);

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

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
