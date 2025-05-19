import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";

@injectable()
export class SobrasServices {
  async addSobras(data: any) {
    console.log("Service: recebendo dados para criar sobra:", data);
    try {
      const result = await prisma.sobras.create({ data });
      console.log("Service: sobra criada no banco:", result);
      return result;
    } catch (error) {
      console.error("Service: erro ao criar sobra:", error);
      throw error;
    }
  }
}
