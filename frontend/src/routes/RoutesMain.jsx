import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { SalaNobrePage } from "../pages/SalaNobrePage";
// import { SobrasPage } from "../pages/SobrasPage";
import { PontosPage } from "../pages/PontosPage";
// import { ColaboradoresPage } from "../pages/ColaboradoresPage";
import { MaintenancePage } from "../pages/MaintenancePage";
// import { RankingExpedicaoPage } from "../pages/RankingExpedicaoPage";
import { SeparacaoJirauPage } from "../pages/SeparacaoJirauPage";

export const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainPage />}>
          <Route path="/seperacao_jirau" element={<SeparacaoJirauPage />} />
          {/* <Route path="/ranking_expedicao" element={<RankingExpedicaoPage />} /> */}
          <Route path="/fluxo_nobre" element={<SalaNobrePage />} />
          {/* <Route path="/sobras" element={<SobrasPage />} /> */}
          <Route path="ponto" element={<PontosPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          {/* <Route path="jirau" element={<ColaboradoresPage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};
