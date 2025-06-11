import { Router } from "express";
import { SalaNobreController } from "../controllers/salanobre.controllers";
import { IsValidBody } from "../middleware/isValidBody.middleware";
import { createCaixasSchema } from "../schemas/salanobre.schema";
import { verifyRole } from "../middleware/verifyRole.middleware";

export const salaNobreRoutes = Router();

const salaNobreControllers = new SalaNobreController();

<<<<<<< Updated upstream
salaNobreRoutes.post("/", IsValidBody.execute({ body: createCaixasSchema}), salaNobreControllers.createCaixas);
salaNobreRoutes.get("/", salaNobreControllers.getCaixas);
=======
salaNobreRoutes.post("/", verifyRole(["ADMIN", "NOBRE"]), IsValidBody.execute({ body: createCaixasSchema}), salaNobreControllers.createCaixas);
salaNobreRoutes.get("/",  salaNobreControllers.getCaixas);
>>>>>>> Stashed changes
