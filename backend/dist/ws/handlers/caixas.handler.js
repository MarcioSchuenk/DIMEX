"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCaixasHandlers = registerCaixasHandlers;
function registerCaixasHandlers(socket) {
    // Aqui você pode registrar eventos customizados se quiser
    socket.on('pingCaixas', () => {
        socket.emit('pongCaixas', { ok: true });
    });
}
