import { Request, Response } from "express";
import {
  buscarFuncionariosKairos,
  buscarPontosKairos,
} from "../services/kairos.services";
import { Funcionario } from "../interface/kairos.interface";

/**
 * Ajusta a data do ponto para pertencer à jornada correta.
 * Se a hora for menor que 4, considera como parte do dia anterior.
 */
function ajustarDataJornada(ponto: {
  Dia: number;
  Mes: number;
  Ano: number;
  Hora: number;
}): string {
  const { Dia, Mes, Ano, Hora } = ponto;
  const dataOriginal = new Date(Ano, Mes - 1, Dia, Hora);

  if (Hora < 4) {
    dataOriginal.setDate(dataOriginal.getDate() - 1);
  }

  return dataOriginal.toLocaleDateString("pt-BR"); // Formato DD/MM/YYYY
}

export const gerarRelatorioPontos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { inicio, fim, page = "1", limit = "10", nome = "" } = req.query;

    if (!inicio || !fim) {
      res
        .status(400)
        .json({ error: "Parâmetros 'inicio' e 'fim' são obrigatórios." });
      return;
    }

    const funcionarios = await buscarFuncionariosKairos();

    const dadosFiltrados = funcionarios
      .map(({ Nome, Matricula }: Funcionario) => ({
        nome: Nome,
        matricula: Matricula,
      }))
      .filter((func: { nome: string }) =>
        func.nome.toLowerCase().includes((nome as string).toLowerCase())
      );

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const funcionariosPaginados = dadosFiltrados.slice(startIndex, endIndex);
    const matriculasPaginadas = funcionariosPaginados.map(
      (f: { matricula: any }) => f.matricula
    );

    const pontos = await buscarPontosKairos(
      String(inicio),
      String(fim),
      matriculasPaginadas
    );

    const agrupado = funcionariosPaginados.map(
      (func: { matricula: any; nome: any }) => {
        const pontosFuncionario = pontos.filter(
          (p: { Matricula: any }) => p.Matricula === func.matricula
        );

        const pontosPorDia: Record<
          string,
          { hora: number; minuto: number; dataCompleta: Date }[]
        > = {};

        pontosFuncionario.forEach((ponto: { Hora: any; Minuto?: any; Ano: any; Mes: any; Dia: any; }) => {
          const hora = ponto.Hora;
          const minuto = ponto.Minuto;
          const dataCompleta = new Date(
            ponto.Ano,
            ponto.Mes - 1,
            ponto.Dia,
            hora,
            minuto
          );

          const dataCorrigida = ajustarDataJornada(ponto);

          if (!pontosPorDia[dataCorrigida]) {
            pontosPorDia[dataCorrigida] = [];
          }

          pontosPorDia[dataCorrigida].push({
            hora,
            minuto,
            dataCompleta,
          });
        });

        const pontosAgrupados = Object.entries(pontosPorDia).map(
          ([data, marcacoes]) => {
            const ordenadas = marcacoes
              .sort(
                (a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime()
              )
              .slice(0, 4);

            return {
              data,
              marcacoes: ordenadas.map(({ hora, minuto }) => ({
                Hora: hora,
                Minuto: minuto,
              })),
            };
          }
        );

        return {
          nome: func.nome,
          matricula: func.matricula,
          pontos: pontosAgrupados,
        };
      }
    );

    res.json({
      page: pageNumber,
      limit: limitNumber,
      totalFuncionarios: dadosFiltrados.length,
      totalPaginas: Math.ceil(dadosFiltrados.length / limitNumber),
      dados: agrupado,
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao gerar relatório de pontos." });
  }
};
