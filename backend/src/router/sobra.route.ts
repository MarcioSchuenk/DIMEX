import { Router } from "express";
import { SobrasController } from "../controllers/sobras.controllers";
import { IsValidBody } from "../middleware/isValidBody.middleware";
import { createSobrasSchema } from "../schemas/sobras.schemas";

export const sobrasRoutes = Router();

const sobrasControllers = new SobrasController();

sobrasRoutes.post("/", IsValidBody.execute({ body: createSobrasSchema}), sobrasControllers.createSobras);
sobrasRoutes.get("/", sobrasControllers.getAllSobras);
