import { Router } from "express";
import { SobrasController } from "../controllers/sobras.controllers";

export const routes = Router();

export const sobrasRoutes = () => {
  routes.post("/sobras", async (req, res, next) => {
    try {
      await new SobrasController().createSobras(req, res);
    } catch (error) {
      next(error);
    }
  });
};
