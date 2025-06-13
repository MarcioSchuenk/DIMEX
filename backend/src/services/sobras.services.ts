import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";
import { FiltroSobras } from "../interface/sobras.interface";

@injectable()
export class SobrasServices {
  async addSobras(data: SobrasServices) {
    return await prisma.sobras.create({ data });
  }
  async getAllSobras(filtro?: FiltroSobras) {
    const { data, codigoProduto } = filtro || {};

    const where: any = {};
    if (data) {
      const start = new Date(data);
      const end = new Date(data);
      end.setDate(end.getDate() + 1);

      where.created_at = {
        gte: start,
        lte: end,
      };
    }

    if (codigoProduto) {
      where.codigo = codigoProduto;
    }

    return await prisma.sobras.findMany({
      where,
      select: {
        codigo: true,
        quantidade: true,
        pedido_cancelado: true,
        localizacao: true,
        onde_qual: true,
        description: true,
      },
    });
  }
}
