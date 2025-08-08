import { PrismaClient as PrismaClientDimex } from "@prisma/client-dimex";
import { PrismaClient as PrismaClientCplus } from "@prisma/client-cplus";

export const prismaMain = new PrismaClientDimex();
export const prismaCplus = new PrismaClientCplus();

