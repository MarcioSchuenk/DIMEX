"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SobrasServices = void 0;
const prisma_1 = require("../database/prisma");
const tsyringe_1 = require("tsyringe");
let SobrasServices = class SobrasServices {
    async addSobras(data) {
        return await prisma_1.prisma.sobras.create({ data });
    }
    async getAllSobras() {
        return await prisma_1.prisma.sobras.findMany();
    }
};
exports.SobrasServices = SobrasServices;
exports.SobrasServices = SobrasServices = __decorate([
    (0, tsyringe_1.injectable)()
], SobrasServices);
