import { Router } from "express";
import { SalaNobreController } from "../controllers/salanobre.controllers";
import { IsValidBody } from "../middleware/isValidBody.middleware";
import { createCaixasSchema } from "../schemas/salanobre.schema";
import { verifyToken } from "../middleware/verifyToken.middleware";
import { verifyRole } from "../middleware/verifyRole.middleware";

export const salaNobreRoutes = Router();

const salaNobreControllers = new SalaNobreController();

salaNobreRoutes.post("/", verifyToken.execute, verifyRole(["ADMIN", "NOBRE"]), IsValidBody.execute({ body: createCaixasSchema}), salaNobreControllers.createCaixas);
salaNobreRoutes.get("/", verifyToken.execute, verifyRole(["ADMIN", "NOBRE"]), salaNobreControllers.getCaixas);
