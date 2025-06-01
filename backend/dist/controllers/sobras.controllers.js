"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SobrasController = void 0;
const sobras_services_1 = require("../services/sobras.services");
const tsyringe_1 = require("tsyringe");
class SobrasController {
    async createSobras(req, res) {
        const sobrasServices = tsyringe_1.container.resolve(sobras_services_1.SobrasServices);
        const data = req.body;
        const response = await sobrasServices.addSobras(data);
        res.status(201).json(response);
    }
    async getAllSobras(req, res) {
        const sobrasServices = tsyringe_1.container.resolve(sobras_services_1.SobrasServices);
        const response = await sobrasServices.getAllSobras();
        res.status(200).json(response);
    }
}
exports.SobrasController = SobrasController;
