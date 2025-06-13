import "reflect-metadata";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { json } from "express";
import "express-async-errors";
import { sobrasRoutes } from "./router/sobra.route";
import { salaNobreRoutes } from "./router/salanobre.route";
import { userRoutes } from "./router/user.route";
import { HandleErrors } from "./error/handleErrors.middleware";

export const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(cors({
    origin: "https://dimex-nu.vercel.app",
    credentials: true,
}));

app.use(json());

app.use("/sobras", sobrasRoutes);
app.use("/caixas", salaNobreRoutes);
app.use("/users", userRoutes);

app.use(HandleErrors.execute);
