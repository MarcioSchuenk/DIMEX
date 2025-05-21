import 'reflect-metadata';
import helmet from "helmet";
import cors from "cors";
import express, {json} from "express";
import "express-async-errors";
import { sobrasRoutes } from "./router/sobra.route";
import { salaNobreRoutes } from './router/salanobre.route';
import { userRoutes } from './router/user.route';


export const app = express();



app.use(helmet());

app.use(cors());

app.use(json());

app.use('/sobras', sobrasRoutes);
app.use('/caixas', salaNobreRoutes);
app.use("/users", userRoutes)
