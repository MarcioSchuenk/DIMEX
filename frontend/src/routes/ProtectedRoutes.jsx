import { useAuth } from "../context/AuthContext"; // sem importar AuthContext diretamente
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" />;
};
