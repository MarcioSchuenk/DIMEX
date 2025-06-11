import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";
import { Salanobre_Interface } from "../interface/salanobre.interface";

@injectable()
export class SalaNobreServices {
  async createCaixas(data: Salanobre_Interface) {
    return await prisma.caixas.create({ data });
  }
  async getCaixas() {
    // Retorna os dados crus diretamente do banco
    return await prisma.caixas.findMany({
      orderBy: {
        created_at: "asc", // opcional: ordena por data
      },
    });
  }
}

