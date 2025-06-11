"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaNobreController = void 0;
const salanobre_services_1 = require("../services/salanobre.services");
const tsyringe_1 = require("tsyringe");
const ws_1 = require("../ws"); // 👈 importa WebSocket
class SalaNobreController {
    async createCaixas(req, res) {
        const salaNobreServices = tsyringe_1.container.resolve(salanobre_services_1.SalaNobreServices);
        const data = req.body;
        const response = await salaNobreServices.createCaixas(data);
        // 👇 Emite o evento para todos os clientes conectados
        const io = (0, ws_1.getIO)();
        if (Array.isArray(response)) {
            response.forEach((caixa) => io.emit("novaCaixa", caixa));
        }
        else {
            io.emit("novaCaixa", response);
        }
        res.status(201).json(response);
    }
    async getCaixas(req, res) {
        const salaNobreServices = tsyringe_1.container.resolve(salanobre_services_1.SalaNobreServices);
        const response = await salaNobreServices.getCaixas();
        res.status(200).json(response);
    }
}
exports.SalaNobreController = SalaNobreController;
