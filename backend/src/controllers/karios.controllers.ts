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
  let { dataInicio, dataFim, nome, filtrarAtrasos, pagina } = req.query;

  if (!dataInicio || !dataFim) {
    res.status(400).json({ error: "Parâmetros 'dataInicio' e 'dataFim' são obrigatórios." });
    return;
  }

  const paginaAtual = parseInt(pagina as string) || 1;
  const limitePorPagina = 15;
  const isFiltrarAtrasos = filtrarAtrasos === "true";

  try {
    const funcionarios = await buscarFuncionariosKairos();

    const funcionariosFiltrados = funcionarios.filter(f =>
      !nome || f.Nome.toLowerCase().includes((nome as string).toLowerCase())
    );

    // Paraleliza as requisições de pontos para todos os funcionários
    const promises = funcionariosFiltrados.map(async (func) => {
      const pontos = await buscarPontosKairos(dataInicio as string, dataFim as string, [func.Matricula]);

      if (!Array.isArray(pontos) || pontos.length === 0) return null;

      for (const ponto of pontos) {
        ponto.dataJornada = ajustarDataParaJornada(ponto);
      }

      const pontosOrdenados = pontos.sort((a, b) => {
        const dataA = dayjs(`${a.Ano}-${a.Mes}-${a.Dia} ${a.Hora}:${a.Minuto}`);
        const dataB = dayjs(`${b.Ano}-${b.Mes}-${b.Dia} ${b.Hora}:${b.Minuto}`);
        return dataA.diff(dataB);
      });

      const pontosAgrupados: Record<string, any[]> = {};
      for (const ponto of pontosOrdenados) {
        if (!pontosAgrupados[ponto.dataJornada]) {
          pontosAgrupados[ponto.dataJornada] = [];
        }
        pontosAgrupados[ponto.dataJornada].push(ponto);
      }

      const pontosFormatados: any[] = [];

      for (const data in pontosAgrupados) {
        const pontosDoDia = pontosAgrupados[data];
        if (pontosDoDia.length === 0) continue;

        const primeiroPonto = pontosDoDia[0];
        const atraso = primeiroPonto.Minuto > 6 && primeiroPonto.Minuto < 54;

        if (isFiltrarAtrasos) {
          if (atraso) {
            // Marca o atraso no primeiro ponto e inclui todos os pontos do dia
            primeiroPonto.atraso = true;
            pontosFormatados.push(...pontosDoDia);
          }
          // Se não houve atraso e estamos filtrando atrasos, ignora esse dia
        } else {
          // Mesmo que não tenha atraso, retorna todos os pontos
          primeiroPonto.atraso = atraso; // marca se teve atraso, só informativo
          pontosFormatados.push(...pontosDoDia);
        }
      }


      if (pontosFormatados.length === 0) return null;

      return {
        nome: func.Nome,
        matricula: func.Matricula,
        pontos: pontosFormatados,
      };
    });

    const resultados = (await Promise.all(promises)).filter(Boolean) as any[];

    // Paginação final
    const totalFuncionarios = resultados.length;
    const totalPaginas = Math.ceil(totalFuncionarios / limitePorPagina);

    const dadosPaginados = resultados.slice(
      (paginaAtual - 1) * limitePorPagina,
      paginaAtual * limitePorPagina
    );

    res.status(200).json({
      pagina: paginaAtual,
      limite: limitePorPagina,
      totalFuncionarios,
      totalPaginas,
      dados: dadosPaginados,
    });

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};
