import { NextFunction, Request, Response } from "express";
import { AppError } from "./erros";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

const knownErrors: Record<string, { status: number; message: string }> = {
  "User not found": { status: 404, message: "User not found" },
  "User not exists": { status: 404, message: "User not exists" },
  "User already exists": { status: 409, message: "User already exists" },
  "Invalid login or password": { status: 401, message: "Invalid login or password" },
  "Invalid token": { status: 401, message: "Invalid token" },
  "Token expired": { status: 401, message: "Token expired" },
  "Login is required": { status: 400, message: "Login is required" },
  "Password is required": { status: 400, message: "Password is required" },
};

export class HandleErrors {
  static execute(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ error: err.message });
    }

    if (err instanceof ZodError) {
      res.status(400).json({ errors: err.errors });
    }

    const knownError = knownErrors[err.message];
    if (knownError) {
      res.status(knownError.status).json({ error: knownError.message });
    }

    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
}
