import "reflect-metadata";
import helmet from "helmet";
import cors from "cors";
import express, { json } from "express";
import "express-async-errors";
import { sobrasRoutes } from "./router/dimexRouter/sobra.route";
import { salaNobreRoutes } from "./router/dimexRouter/salanobre.route";
import { userRoutes } from "./router/dimexRouter/user.route";
import { HandleErrors } from "./error/handleErrors.middleware";
import { apiKairos } from "./router/dimexRouter/kairos.routes";
import { cplusRoutes } from "./router/cplusRouter/cplus.route";

export const app = express();

app.use(helmet());

app.use(cors());

app.use(json());

app.use("/sobras", sobrasRoutes);
app.use("/caixas", salaNobreRoutes);
app.use("/users", userRoutes);
app.use("/pontos", apiKairos);

// Cplus Rotas

app.use("/cplus5", cplusRoutes);

app.use(HandleErrors.execute);
