import { Router } from "express";
import { CplusController } from "../../controllers/cplusControllers/cplus.controllers";

export const cplusRoutes = Router();

const cplusControllers = new CplusController();

cplusRoutes.get("/romaneio", cplusControllers.getRomaneio);