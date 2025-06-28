import { apiKairos } from "../utils/apiKairos";

export const buscarFuncionariosKairos = async () => {

  const body = {
    Matriculas: []
  };

  try {
    const response = await apiKairos.post("People/SearchPeople", body);
    return response.data.Obj;
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    throw error;
  }
};

export const buscarPontosKairos = async (dataInicio: string, dataFim: string, matriculas: number[]) => {
    
  const body = {
    MatriculaPessoa: matriculas,
    DataInicio: dataInicio,
    DataFim: dataFim,
    ResponseType: "AS400V1"
  };

  try {
    const response = await apiKairos.post("/Mark/GetMarks", body);
    return response.data.Obj;

  } catch (error) {

    console.error("Erro ao buscar pontos:", error);
    throw error;
  }
};

