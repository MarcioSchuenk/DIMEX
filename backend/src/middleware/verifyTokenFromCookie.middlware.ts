import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export class verifyTokenFromCookie {
  static execute(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void {
    console.log("🔍 Cookies recebidos:", req.cookies);
    console.log("🔍 Headers:", req.headers.cookie);
    
    const token =
      req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return; // <- Apenas interrompe a função, sem retornar um Response
    }

    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as { id: number; role: string };

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
  }
}
