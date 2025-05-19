import {z} from 'zod';

const salanobreSchema = z.object({
    id: z.number().int().positive(),
    codigo: z.string().min(1).max(15)
}).strict();

export const createCaixasSchema = salanobreSchema.omit({ id: true });