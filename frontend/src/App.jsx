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
  LabelList,
} from "recharts";
import "./styles/app.scss";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL, {
  transports: ["websocket"],
});

const gerarHoras = () => {
  const horas = [];
  for (let i = 8; i <= 21; i++) {
    horas.push(`${i.toString().padStart(2, "0")}h`);
  }
  return horas;
};

function App() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [dadosBrutos, setDadosBrutos] = useState([]);
  const [dadosPorHora, setDadosPorHora] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    media: 0,
    pico: null,
    menor: null,
  });
  const [forcarAtualizacao, setForcarAtualizacao] = useState(false);

  const formatarDataLocal = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const res = await axios.get(`${API_URL}/caixas`, {
          headers: {
            "ngrok-skip-browser-warning": "true", // 👈 isso pula a página de aviso
          },
        });
        setDadosBrutos(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    buscarDados();
  }, []);

  useEffect(() => {
    socket.on("novaCaixa", (novaCaixa) => {
      console.log("Nova caixa recebida via socket:", novaCaixa);

      setDadosBrutos((prev) => {
        const novosDados = [...prev, novaCaixa];
        console.log("Dados brutos atualizados:", novosDados);
        return novosDados;
      });

      // Força sempre o reprocessamento
      setForcarAtualizacao((prev) => !prev);
    });

    return () => {
      socket.off("novaCaixa");
    };
  }, []);

  useEffect(() => {
    const horas = gerarHoras();
    const dadosFiltrados = dadosBrutos.filter((caixa) => {
      const dataCaixa = new Date(caixa.created_at);
      const dataFormatadaCaixa = formatarDataLocal(dataCaixa);
      return dataFormatadaCaixa === dataSelecionada;
    });

    console.log(`Processando dados para a data ${dataSelecionada}`);
    console.log("Dados filtrados:", dadosFiltrados);

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
              domain={[0, "dataMax + 10"]}
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
