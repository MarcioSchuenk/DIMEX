import { Socket } from "socket.io"

export function registerCaixasHandlers(socket: Socket) {
  // Aqui você pode registrar eventos customizados se quiser
  socket.on('pingCaixas', () => {
    socket.emit('pongCaixas', { ok: true })
  })
}
