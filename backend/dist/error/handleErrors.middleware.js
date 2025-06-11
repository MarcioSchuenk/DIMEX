"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleErrors = void 0;
const erros_1 = require("./erros");
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const knownErrors = {
    "User not found": { status: 404, message: "User not found" },
    "User not exists": { status: 404, message: "User not exists" },
    "User already exists": { status: 409, message: "User already exists" },
    "Invalid login or password": { status: 401, message: "Invalid login or password" },
    "Invalid token": { status: 401, message: "Invalid token" },
    "Token expired": { status: 401, message: "Token expired" },
    "Login is required": { status: 400, message: "Login is required" },
    "Password is required": { status: 400, message: "Password is required" },
};
class HandleErrors {
    static execute(err, req, res, next) {
        if (err instanceof erros_1.AppError) {
            res.status(err.statusCode).json({ error: err.message });
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({ error: err.message });
        }
        if (err instanceof zod_1.ZodError) {
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
exports.HandleErrors = HandleErrors;
