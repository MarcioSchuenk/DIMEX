import { prisma } from "../database/prisma";
import { injectable } from "tsyringe";
import { Salanobre_Interface } from "../interface/salanobre.interface";

@injectable()
export class SalaNobreServices {
  async createCaixas(data: Salanobre_Interface) {
    return await prisma.caixas.create({ data });
  }
  async getCaixas() {
    const caixas = await prisma.caixas.findMany();

    const formatado = caixas.map((item) => {
      const created = new Date(item.created_at);

      const formatarData = (data: Date) => {
        return data.toLocaleDateString("pt-BR"); // Ex: 20/05/2025
      };

      const formatarHora = (data: Date) => {
        return data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }); // Ex: 13:29:55
      };

      return {
        ...item,
        dataFormatada: formatarData(created),
        horaFormatada: formatarHora(created),
      };
    });

    return formatado;
  }
}
