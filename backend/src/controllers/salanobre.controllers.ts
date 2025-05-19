import { Request, Response } from "express";
import { SalaNobreServices } from "../services/salanobre.services";
import { container } from "tsyringe";

export class SalaNobreController {
  async createCaixas(req: Request, res: Response): Promise<void> {
    const salaNobreServices = container.resolve(SalaNobreServices);
    const data = req.body;

    const response = await salaNobreServices.createCaixas(data);

    res.status(201).json(response);
  }
}
