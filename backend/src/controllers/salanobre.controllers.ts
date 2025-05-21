import { Request, Response } from "express";
import { SalaNobreServices } from "../services/salanobre.services";
import { container } from "tsyringe";
import { getIO } from "../ws"; // 👈 importa WebSocket

export class SalaNobreController {
  async createCaixas(req: Request, res: Response): Promise<void> {
    const salaNobreServices = container.resolve(SalaNobreServices);
    const data = req.body;

    const response = await salaNobreServices.createCaixas(data);

    // 👇 Emite o evento para todos os clientes conectados
    const io = getIO();
    if (Array.isArray(response)) {
      response.forEach((caixa) => io.emit("novaCaixa", caixa));
    } else {
      io.emit("novaCaixa", response);
    }

    res.status(201).json(response);
  }

  async getCaixas(req: Request, res: Response): Promise<void> {
    const salaNobreServices = container.resolve(SalaNobreServices);
    const response = await salaNobreServices.getCaixas();

    res.status(200).json(response);
  }
}
