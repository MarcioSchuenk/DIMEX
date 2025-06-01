"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.userLoginSchema = exports.UserSchema = exports.RoleInsensitive = exports.RoleEnum = void 0;
const zod_1 = require("zod");
exports.RoleEnum = zod_1.z.enum(["USER", "ADMIN", "NOBRE"]);
exports.RoleInsensitive = zod_1.z
    .string()
    .transform(str => str.toUpperCase())
    .refine(val => exports.RoleEnum.options.includes(val), {
    message: "Invalid role value",
});
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    login: zod_1.z.string().nullable().optional(),
    password: zod_1.z.string().nullable().optional(),
    role: exports.RoleInsensitive.default("USER"),
    createdAt: zod_1.z.date().default(new Date()),
    updatedAt: zod_1.z.date(),
});
exports.userLoginSchema = exports.UserSchema.omit({ id: true, role: true, createdAt: true, updatedAt: true });
exports.createUserSchema = exports.UserSchema.omit({ id: true, createdAt: true, updatedAt: true });
