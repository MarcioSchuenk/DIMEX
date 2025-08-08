import { prismaMain } from "../../database/prisma";
import { injectable } from "tsyringe";
import { Salanobre_Interface } from "../../interface/salanobre.interface";

@injectable()
export class SalaNobreServices {
  async createCaixas(data: Salanobre_Interface) {
    return await prismaMain.caixas.create({ data });
  }
  async getCaixas() {
    // Retorna os dados crus diretamente do banco
    return await prismaMain.caixas.findMany({
      orderBy: {
        created_at: "asc", // opcional: ordena por data
      },
    });
  }
}

