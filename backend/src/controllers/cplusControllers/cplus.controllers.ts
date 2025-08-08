
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CplusServices } from "../../services/cplus/cplus.services";

export class CplusController {
    async getRomaneio(req: Request, res: Response) {
        const cplusServices = container.resolve(CplusServices);

        const motoristas = await cplusServices.buscarRomaneio();
        res.status(200).json(motoristas);
    }
}