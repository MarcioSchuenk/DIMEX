import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProtectedRoutes } from "./ProtectedRoutes"; // ajuste o caminho conforme seu projeto

export const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};
