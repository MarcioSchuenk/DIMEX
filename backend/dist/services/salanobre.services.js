"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaNobreServices = void 0;
const prisma_1 = require("../database/prisma");
const tsyringe_1 = require("tsyringe");
let SalaNobreServices = class SalaNobreServices {
    async createCaixas(data) {
        return await prisma_1.prisma.caixas.create({ data });
    }
    async getCaixas() {
        const caixas = await prisma_1.prisma.caixas.findMany();
        const formatado = caixas.map((item) => {
            const created = new Date(item.created_at);
            const formatarData = (data) => {
                return data.toLocaleDateString("pt-BR"); // Ex: 20/05/2025
            };
            const formatarHora = (data) => {
                return data.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }); // Ex: 13:29:55
            };
            return {
                ...item,
                dataFormatada: formatarData(created),
                horaFormatada: formatarHora(created),
            };
        });
        return formatado;
    }
};
exports.SalaNobreServices = SalaNobreServices;
exports.SalaNobreServices = SalaNobreServices = __decorate([
    (0, tsyringe_1.injectable)()
], SalaNobreServices);
