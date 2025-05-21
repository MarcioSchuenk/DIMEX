import { app } from "./app";
import http from "http";
import { initWebSocket } from "./ws"; // <- seu módulo de WebSocket

const server = http.createServer(app); // cria um servidor HTTP com o Express

initWebSocket(server); // inicializa o socket.io com esse servidor

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
