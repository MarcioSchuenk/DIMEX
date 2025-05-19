import 'reflect-metadata';
import helmet from "helmet";
import express, {json} from "express";
import "express-async-errors";
import { routes, sobrasRoutes } from "./router/sobra.route";
import { salaNobreRoutes } from './router/salanobre.route';


export const app = express();



app.use(helmet());

app.use(json());

app.use('/sobras', sobrasRoutes);
app.use('/caixas', salaNobreRoutes);
