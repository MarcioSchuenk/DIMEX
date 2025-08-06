import { PrismaClient as PrismaClientDimex } from "@prisma/client";
import { PrismaClient as PrismaClientCplus} from "../../prisma/cplus/@prisma/client-cplus/client";

export const prismaMain = new PrismaClientDimex();
export const prismaCplus = new PrismaClientCplus();

