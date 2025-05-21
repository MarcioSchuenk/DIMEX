import { Server } from 'socket.io'
import http from 'http'
import { registerCaixasHandlers } from './handlers/caixas.handler'

let io: Server

export function initWebSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    }
  })

  io.on('connection', (socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`)

    // Registra handlers de eventos
    registerCaixasHandlers(socket)

    socket.on('disconnect', () => {
      console.log(`🔴 Cliente desconectado: ${socket.id}`)
    })
  })
}

export function getIO() {
  if (!io) throw new Error("Socket.io não foi inicializado ainda.")
  return io
}
