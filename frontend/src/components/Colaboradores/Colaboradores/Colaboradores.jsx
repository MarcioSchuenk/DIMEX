import { useEffect } from "react";

export const Colaboradores = () => {
  useEffect(() => {
    const getColaboradores = async () => {
      try {
        const response = await api.get("/colaboradores");
        console.log(response.data);
      } catch (err) {
        console.error("Erro ao buscar colaboradores:", err);
      }
    };

    getColaboradores();
  });

  return (
    <div>
      <h1>Colaboradores</h1>
    </div>
  );
};
