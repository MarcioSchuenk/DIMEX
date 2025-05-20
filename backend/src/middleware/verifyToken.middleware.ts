import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class verifyToken {
    static execute(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            throw new Error("Token is required");
        }
        
        const secret = process.env.JWT_SECRET as string;

        jwt.verify(token, secret);

        const decoded = jwt.decode(token);
        
        res.locals.decode = decoded;

        next();
    }
}

