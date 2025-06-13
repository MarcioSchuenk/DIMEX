import {z} from 'zod';

export const sobrasSchema = z.object({
    id: z.number().int().positive().optional(),
    codigo: z.string().min(1).max(15).optional(),
    quantidade: z.number().int().positive().optional(),
    pedido_cancelado: z.string().optional().optional(),
    localizacao: z.string().min(1).max(50).optional(),
    quadrante: z.string().min(1).max(50).optional(),
    onde_qual: z.string().min(1).max(50).optional(),
    description : z.string().min(1).max(100).optional(),
    createdAt: z.date().default(new Date()).optional(),
    updatedAt: z.date().default(new Date()).optional(),
}).strict();

export const createSobrasSchema = sobrasSchema.omit({id: true, createdAt: true, updatedAt: true});

export const updateSobrasSchema = sobrasSchema.partial().omit({id: true, createdAt: true, updatedAt: true});
