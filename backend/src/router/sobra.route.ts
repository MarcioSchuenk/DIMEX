import { Router } from "express";
import { SobrasController } from "../controllers/sobras.controllers";

export const sobrasRoutes = Router();

const sobrasControllers = new SobrasController();

sobrasRoutes.post("/", sobrasControllers.createSobras);
sobrasRoutes.get("/", sobrasControllers.getAllSobras);
  