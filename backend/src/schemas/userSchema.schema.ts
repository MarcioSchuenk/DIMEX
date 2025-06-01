
import { z } from "zod";

export const RoleEnum = z.enum(["USER", "ADMIN", "NOBRE"]);

export const RoleInsensitive = z
  .string()
  .transform(str => str.toUpperCase())
  .refine(val => RoleEnum.options.includes(val as any), {
    message: "Invalid role value",
  });

export const UserSchema = z.object({
  id: z.number().int(),
  login: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  role: RoleInsensitive.default("USER"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date(),
});


export const userLoginSchema = UserSchema.omit({id: true, role: true, createdAt: true, updatedAt: true});

export const createUserSchema = UserSchema.omit({id: true, createdAt: true, updatedAt: true});


