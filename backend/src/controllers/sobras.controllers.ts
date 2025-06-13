import { Request, Response } from "express";
import { SobrasServices } from "../services/sobras.services";
import { container } from "tsyringe";

export class SobrasController {
  async createSobras(req: Request, res: Response) {
    const sobrasServices = container.resolve(SobrasServices);
    const data = req.body;

    const response = await sobrasServices.addSobras(data);

    res.status(201).json(response);
  }

  async getAllSobras(req: Request, res: Response) {
    const { data, codigoProduto } = req.query;

    const sobrasServices = container.resolve(SobrasServices);

    const response = await sobrasServices.getAllSobras({
      data: data as string,
      codigoProduto: codigoProduto as string,
    });

    res.status(200).json(response);
  }
}
