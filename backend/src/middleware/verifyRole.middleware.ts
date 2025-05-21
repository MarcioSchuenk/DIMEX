import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest"; // ajuste o path se estiver em outro lugar

export function verifyRole(requiredRole: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== requiredRole) {
      res.status(403).json({ message: "Access denied: insufficient permissions" });
      return;
    }

    next();
  };
}