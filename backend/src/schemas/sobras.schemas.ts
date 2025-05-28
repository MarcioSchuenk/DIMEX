import {z} from 'zod';

export const sobrasSchema = z.object({
    id: z.number().int().positive(),
    codigo: z.string().min(1).max(15),
    quantidade: z.number().int().positive(),
    pedido_cancelado: z.string(),
    localizacao: z.string().min(1).max(50),
    onde_qual: z.string().min(1).max(50),
    description : z.string().min(1).max(100),
}).strict();

