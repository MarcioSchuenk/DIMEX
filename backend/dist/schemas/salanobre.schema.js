"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaixasSchema = void 0;
const zod_1 = require("zod");
const salanobreSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    codigo: zod_1.z.string().min(1).max(15)
}).strict();
exports.createCaixasSchema = salanobreSchema.omit({ id: true });
