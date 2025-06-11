import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { SalaNobrePage } from "../pages/SalaNobrePage";

export const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainPage />}>
          <Route path="/fluxo_nobre" element={<SalaNobrePage />} />
        </Route>
      </Route>
    </Routes>
  );
};
