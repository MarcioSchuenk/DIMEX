import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "@env";

const socket = io(API_URL);

export const registrarCodigoCaixa = async (codigo: string): Promise<void> => {
  const response = await axios.post(`${API_URL}/caixas`, { codigo });

  if (response.status === 201 || response.status === 200) {
    socket.emit("novaCaixa", {
      codigo,
      created_at: new Date().toISOString(),
    });
  } else {
    throw new Error(`Falha no registro. Status: ${response.status}`);
  }
};
