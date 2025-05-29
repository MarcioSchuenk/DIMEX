import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  LabelList,
} from "recharts";
import "./styles/app.scss";
import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;

// Conectando ao servidor WebSocket
const socket = io(API_URL);

// Gera os horários de 08h até 21h
const gerarHoras = () => {
  const horas = [];
  for (let i = 8; i <= 21; i++) {
    horas.push(`${i.toString().padStart(2, "0")}h`);
  }
  return horas;
};

function App() {
  const [dataSelecionada, setDataSelecionada] = useState("2025-05-21");
  const [dadosBrutos, setDadosBrutos] = useState([]);
  const [dadosPorHora, setDadosPorHora] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    media: 0,
    pico: null,
    menor: null,
  });
  const [forcarAtualizacao, setForcarAtualizacao] = useState(false);

  // Busca inicial dos dados
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const res = await axios.get(`${API_URL}/caixas`);
        setDadosBrutos(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    buscarDados();
  }, []);

  // Escuta eventos do WebSocket
  useEffect(() => {
    socket.on("novaCaixa", (novaCaixa) => {
      console.log("Nova caixa recebida via socket:", novaCaixa);

      setDadosBrutos((prev) => [...prev, novaCaixa]);

      const dataDaNovaCaixa = novaCaixa.created_at.slice(0, 10);
      if (dataDaNovaCaixa === dataSelecionada) {
        setForcarAtualizacao((prev) => !prev); // força reprocessamento
      }
    });

    return () => {
      socket.off("novaCaixa");
    };
  }, [dataSelecionada]);

  // Reprocessa os dados quando `dadosBrutos`, `dataSelecionada` ou `forcarAtualizacao` mudarem
  useEffect(() => {
    const horas = gerarHoras();
    const dadosFiltrados = dadosBrutos.filter((caixa) =>
      caixa.created_at.startsWith(dataSelecionada)
    );

    const contagemPorHora = {};

    horas.forEach((hora) => {
      contagemPorHora[hora] = 0;
    });

    dadosFiltrados.forEach((item) => {
      const data = new Date(item.created_at);
      const horaFormatada = `${data.getHours().toString().padStart(2, "0")}h`;
      if (contagemPorHora[horaFormatada] !== undefined) {
        contagemPorHora[horaFormatada]++;
      }
    });

    const dadosFormatados = horas.map((hora) => ({
      hora,
      pacotes: contagemPorHora[hora],
      tendencia: 0,
    }));

    const total = dadosFiltrados.length;
    const media = +(total / horas.length).toFixed(1);
    const pico = dadosFormatados.reduce(
      (prev, curr) => (curr.pacotes > prev.pacotes ? curr : prev),
      { pacotes: -1 }
    );
    const menor = dadosFormatados.reduce(
      (prev, curr) => (curr.pacotes < prev.pacotes ? curr : prev),
      { pacotes: Infinity }
    );

    setDadosPorHora(dadosFormatados);
    setEstatisticas({ total, media, pico, menor });
  }, [dadosBrutos, dataSelecionada, forcarAtualizacao]);

  return (
    <div className="container">
      <h1>Selecione a data:</h1>
      <div className="input-group">
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
        <button onClick={() => setForcarAtualizacao((prev) => !prev)}>
          Consultar
        </button>
      </div>

      <p className="text-sm">
        Última atualização: {new Date().toLocaleTimeString()}
      </p>

      <div className="stats-box">
        <h2>Estatísticas do Dia</h2>
        <p>
          Total de pacotes: <strong>{estatisticas.total}</strong>
        </p>
        <p>
          Média por hora: <strong>{estatisticas.media}</strong>
        </p>
        {estatisticas.pico && (
          <p className="highlight">
            Pico horário:{" "}
            <strong>
              {estatisticas.pico.pacotes} pacotes às {estatisticas.pico.hora}
            </strong>
          </p>
        )}
        {estatisticas.menor && (
          <p className="lowlight">
            Menor movimentação:{" "}
            <strong>
              {estatisticas.menor.pacotes} pacotes às {estatisticas.menor.hora}
            </strong>
          </p>
        )}
      </div>

      <div className="chart-container">
        <h3>Distribuição de Pacotes por Hora</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={dadosPorHora}
            margin={{ top: 30, right: 15, left: -15, bottom: 0 }}
          >
            <CartesianGrid stroke="none" />

            <XAxis
              dataKey="hora"
              interval={0}
              angle={-90}
              textAnchor="end"
              height={80}
              stroke="#ccc"
              tick={{ fill: "#ccc" }}
            />

            <YAxis
              domain={[0, 150]}
              interval={0}
              tickCount={10}
              stroke="#ccc"
              tick={{ fill: "#ccc" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                color: "#ffffff",
                border: "none",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />

            <Legend wrapperStyle={{ color: "#ffffff" }} />

            <Bar dataKey="pacotes" fill="#3b82f6" name="Pacotes por hora">
              <LabelList
                dataKey="pacotes"
                position="top"
                content={({ x, y, value, width }) =>
                  value > 0 ? (
                    <text
                      x={x + width / 2}
                      y={y - 5}
                      fill="#ffffff"
                      textAnchor="middle"
                      fontSize={12}
                    >
                      {value}
                    </text>
                  ) : null
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
