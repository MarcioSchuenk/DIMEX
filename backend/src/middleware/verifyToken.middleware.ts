// src/middleware/verifyToken.middleware.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export class verifyToken {
  static execute(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token is required" });
        return;
    }

    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as unknown as { id: number; role: string };

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
}
