import { Router } from "express";
import { SobrasController } from "../controllers/sobras.controllers";

export const routes = Router();

const sobrasControllers = new SobrasController();

routes.post("/", sobrasControllers.createSobras);
