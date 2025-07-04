import { buscarFuncionariosKairos, buscarPontosKairos } from "../services/kairos.services";
import { Request, Response } from "express";
// req: Request, res: Response
export const gerarRelatorioPontos = async () => {
  // const {dataInicio, dataFim} = req.query;

  // if (!dataInicio || !dataFim) {
  //    return res.status(400).json({ error: "Parâmetros 'dataInicio' e 'dataFim' são obrigatórios." });
  //  }

  const filtrarAtrasos = true;

  try {
    const funcionarios = await buscarFuncionariosKairos();

    const matriculas = funcionarios.map((funcionario) => funcionario.Matricula);


    const pontos = await buscarPontosKairos("30/06/2025" as string, "30/06/2025" as string, matriculas);

    const pontosPorMatricula = new Map<number, any[]>();

    for (const ponto of pontos) {
      const matricula = Number(ponto.Matricula);
      if (!pontosPorMatricula.has(matricula)) {
        pontosPorMatricula.set(matricula, []);
      }
      pontosPorMatricula.get(matricula)!.push(ponto);
    }

    const resultado = [];
    
    for (const func of funcionarios) {
      const matricula = Number(func.Matricula);
      const pontosFuncionario = pontosPorMatricula.get(matricula) || [];

      if (pontosFuncionario.length === 0) continue;

      if (filtrarAtrasos) {
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

    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error("Erro ao buscar pontos:", error);
    // return res.status(500).json({ error: "Erro ao buscar pontos." });
  }
}
