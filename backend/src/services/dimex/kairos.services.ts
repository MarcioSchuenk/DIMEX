import { apiKairos } from "../../utils/apiKairos";

export const buscarFuncionariosKairos = async () => {
  const nomesMatriculas = [];

  const body = {
    Matriculas: []
  };

  try {
    const response = await apiKairos.post("People/SearchPeople", body);
    
    for (const pessoa of response.data.Obj) {
      const { Matricula, Nome } = pessoa;
      nomesMatriculas.push({ Matricula, Nome });
    }

    nomesMatriculas.sort((a, b) => a.Nome.localeCompare(b.Nome));

    return nomesMatriculas;

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
    return Array.isArray(response.data.Obj) ? response.data.Obj : [];

  } catch (error) {

    console.error("Erro ao buscar pontos:", error);
    throw error;
  }
};

