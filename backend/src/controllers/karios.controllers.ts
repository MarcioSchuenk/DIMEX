import { buscarFuncionariosKairos, buscarPontosKairos } from "../services/kairos.services";
import { Request, Response } from "express";
import dayjs from "dayjs";

function ajustarDataParaJornada(ponto: any): string {
  const data = dayjs(`${ponto.Ano}-${ponto.Mes}-${ponto.Dia} ${ponto.Hora}:${ponto.Minuto}`);
  return ponto.Hora < 4
    ? data.subtract(1, 'day').format("DD/MM/YYYY")
    : data.format("DD/MM/YYYY");
}

export const gerarRelatorioPontos = async (req: Request, res: Response): Promise<void> => {
  let {dataInicio, dataFim, nome, filtrarAtrasos} = req.query;

  if (!dataInicio || !dataFim) {
    res.status(400).json({ error: "Parâmetros 'dataInicio' e 'dataFim' são obrigatórios." });
  }
  
  try {
    const funcionarios = await buscarFuncionariosKairos();

    const matriculas = funcionarios
    .filter(funcionario => 
      !nome || funcionario.Nome.toLowerCase().includes((nome as string).toLowerCase())
    )
    .map(funcionario => funcionario.Matricula);

    const pontos = await buscarPontosKairos(dataInicio as string, dataFim as string, matriculas);

    const pontosPorMatricula = new Map<number, any[]>();

    for (const ponto of pontos) {
      const matricula = Number(ponto.Matricula);

      ponto.dataJornada = ajustarDataParaJornada(ponto);
      
      if (!pontosPorMatricula.has(matricula)) {
        pontosPorMatricula.set(matricula, []);
      }
      pontosPorMatricula.get(matricula)!.push(ponto);
    }

    const resultado = [];

    const isFiltrarAtrasos = filtrarAtrasos === "true";
    
    for (const func of funcionarios) {
      const matricula = Number(func.Matricula);
      const pontosFuncionario = pontosPorMatricula.get(matricula) || [];

      if (pontosFuncionario.length === 0) continue;

      if (isFiltrarAtrasos) {
        const primeiroPonto = pontosFuncionario[0];
        if (!primeiroPonto) continue;

        const minuto = primeiroPonto.Minuto;
        const atrasado = minuto > 6 && minuto < 54;

        if (!atrasado) continue;
      }

      resultado.push({
        nome: func.Nome,
        matricula: func.Matricula,
        pontos: pontosFuncionario,
      });
    }

    res.status(200).json(resultado)
  } catch (error) {
    console.error("Erro ao buscar pontos:", error);
    res.status(500).json({ error: "Erro ao buscar pontos." });
  }
}
