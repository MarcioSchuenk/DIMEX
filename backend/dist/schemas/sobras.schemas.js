"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSobrasSchema = exports.createSobrasSchema = exports.sobrasSchema = void 0;
const zod_1 = require("zod");
exports.sobrasSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().optional(),
    codigo: zod_1.z.string().min(1).max(15).optional(),
    quantidade: zod_1.z.number().int().positive().optional(),
    pedido_cancelado: zod_1.z.string().optional().optional(),
    localizacao: zod_1.z.string().min(1).max(50).optional(),
    onde_qual: zod_1.z.string().min(1).max(50).optional(),
    description: zod_1.z.string().min(1).max(100).optional(),
    createdAt: zod_1.z.date().default(new Date()).optional(),
    updatedAt: zod_1.z.date().default(new Date()).optional(),
}).strict();
exports.createSobrasSchema = exports.sobrasSchema.omit({ id: true, createdAt: true, updatedAt: true });
exports.updateSobrasSchema = exports.sobrasSchema.partial().omit({ id: true, createdAt: true, updatedAt: true });
