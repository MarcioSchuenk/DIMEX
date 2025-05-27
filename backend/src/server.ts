import { app } from "./app";
import http from "http";
import { initWebSocket } from "./ws"; // <- seu módulo de WebSocket

const server = http.createServer(app); // cria um servidor HTTP com o Express

initWebSocket(server); // inicializa o socket.io com esse servidor

const PORT = parseInt(process.env.PORT || "3000", 10);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
