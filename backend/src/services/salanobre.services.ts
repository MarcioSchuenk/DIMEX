import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";
import { Salanobre_Interface } from "../interface/salanobre.interface";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

@injectable()
export class SalaNobreServices {
  async createCaixas(data: Salanobre_Interface) {
    return await prisma.caixas.create({ data });
  }

  async getCaixas(filtro?: { dia?: string; mesAno?: string }) {
    let whereCondition = {};

    if (filtro?.dia) {
      // Filtro por dia específico (formato 'yyyy-MM-dd')
      whereCondition = {
        created_at: {
          gte: new Date(`${filtro.dia}T00:00:00.000Z`),
          lt: new Date(`${filtro.dia}T23:59:59.999Z`),
        },
      };
    } else if (filtro?.mesAno) {
      // Filtro por mês/ano (formato 'yyyy-MM')
      const [ano, mes] = filtro.mesAno.split("-");
      const primeiroDia = new Date(`${ano}-${mes}-01T00:00:00.000Z`);
      const ultimoDia = new Date(Number(ano), Number(mes), 0); // Último dia do mês

      whereCondition = {
        created_at: {
          gte: primeiroDia,
          lt: new Date(ultimoDia.setDate(ultimoDia.getDate() + 1)), // Primeiro dia do mês seguinte
        },
      };
    }

    const caixas = await prisma.caixas.findMany({
      where: whereCondition,
      orderBy: {
        created_at: "asc", // Ordena por data crescente
      },
    });

    const caixasFormatados = caixas.map((caixa) => {
      const data = new Date(caixa.created_at);

      return {
        ...caixa,
        dataFormatada: format(data, "dd/MM/yyyy", { locale: ptBR }),
        horaFormatada: format(data, "HH:mm:ss", { locale: ptBR }),
      };
    });

    return caixasFormatados;
  }
}
