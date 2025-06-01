"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class verifyToken {
    static execute(req, res, next) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Token is required" });
            return;
        }
        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
}
exports.verifyToken = verifyToken;
