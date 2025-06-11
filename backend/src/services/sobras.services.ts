import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";

@injectable()
export class SobrasServices {
  async addSobras(data: SobrasServices) {
    return await prisma.sobras.create({ data });
  }
  async getAllSobras() {
    return await prisma.sobras.findMany()
  }
}
