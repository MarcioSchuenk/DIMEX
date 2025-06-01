"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = initWebSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const caixas_handler_1 = require("./handlers/caixas.handler");
let io;
function initWebSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        }
    });
    io.on('connection', (socket) => {
        console.log(`🟢 Cliente conectado: ${socket.id}`);
        // Registra handlers de eventos
        (0, caixas_handler_1.registerCaixasHandlers)(socket);
        socket.on('disconnect', () => {
            console.log(`🔴 Cliente desconectado: ${socket.id}`);
        });
    });
}
function getIO() {
    if (!io)
        throw new Error("Socket.io não foi inicializado ainda.");
    return io;
}
