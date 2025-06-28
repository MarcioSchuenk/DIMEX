import { Router } from "express";
import { gerarRelatorioPontos } from "../controllers/karios.controllers";

export const apiKairos = Router();

apiKairos.get("/", gerarRelatorioPontos);
