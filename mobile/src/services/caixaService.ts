import { api } from "./api";
import { io } from "socket.io-client";
import { API_URL } from "@env";

const socket = io(API_URL);

export const registrarCodigoCaixa = async (codigo: string): Promise<void> => {
  const response = await api.post("/caixas", { codigo });

  if (response.status === 200 || response.status === 201) {
    socket.emit("novaCaixa", {
      codigo,
      created_at: new Date().toISOString(),
    });
  } else {
    throw new Error(`Falha no registro. Status: ${response.status}`);
  }
};
