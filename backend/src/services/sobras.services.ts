import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";

@injectable()
export class SobrasServices {
  async addSobras(data: any) {
    return await prisma.sobras.create({ data });
  }
}
