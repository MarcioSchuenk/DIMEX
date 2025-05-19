import { Router } from "express";
import { SalaNobreController } from "../controllers/salanobre.controllers";
import { IsValidBody } from "../middleware/salanobre.middleware";
import { createCaixasSchema } from "../schemas/salanobre.schema";

export const salaNobreRoutes = Router();

const salaNobreControllers = new SalaNobreController();

salaNobreRoutes.post("/", IsValidBody.execute({ body: createCaixasSchema}), salaNobreControllers.createCaixas);



