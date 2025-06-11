import { useState } from "react";

export const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div>
      <h2>Painel</h2>
      <nav>
        {/* Expedição */}
        <div>
          <p onClick={() => toggleSection("expedicao")}>📁 Expedição</p>
          {openSection === "expedicao" && (
            <div>
              <p>▶️ Subitem 1</p>
              <a href="https://dimex-nu.vercel.app" target="_blank">▶️ Fluxo Sala Nobre</a>
            </div>
          )}
        </div>

        {/* Rodoviários */}
        <div>
          <p onClick={() => toggleSection("rodoviarios")}>📁 Rodoviários</p>
          {openSection === "rodoviarios" && (
            <div>
              <p>▶️ Subitem A</p>
              <p>▶️ Subitem B</p>
            </div>
          )}
        </div>

        {/* Oficina */}
        <div>
          <p onClick={() => toggleSection("oficina")}>📁 Oficina</p>
          {openSection === "oficina" && (
            <div>
              <p>▶️ Mecânica</p>
              <p>▶️ Elétrica</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
