import { Request, Response } from "express";
import { SobrasServices } from "../services/sobras.services";
import { container } from "tsyringe";

export class SobrasController {
    async createSobras(req: Request, res: Response) {
        const sobrasServices = container.resolve(SobrasServices);
        console.log("Recebendo dados para criar sobra:", req.body);

        try {
            const response = await sobrasServices.addSobras(req.body);
            console.log("Sobra criada com sucesso:", response);
            return res.status(201).json(response);
        } catch (error) {
            console.error("Erro ao criar sobra:", error);
            return res.status(500).json({ error: "Erro interno ao criar sobra" });
        }
    }
}
