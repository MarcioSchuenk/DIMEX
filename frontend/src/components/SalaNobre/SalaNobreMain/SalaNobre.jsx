import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../../../services/api";
import { gerarHoras, formatarDataLocal } from "../../../utils/SalaNobreHoras";
import { DataSelector } from "../DataSelector/DataSelector";
import { StatsCard } from "../StatsCards/StatsCard";
import { PacotesBarChart } from "../PacotesBarChart/PacotesBarChart";
import styles from "./styles.module.scss";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL, {
  transports: ["websocket"],
});

export const SalaNobre = () => {
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

  console.log(dataSelecionada)

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const res = await api.get("/caixas");
        setDadosBrutos(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    buscarDados();
  }, []);

  useEffect(() => {
    socket.on("novaCaixa", (novaCaixa) => {
      setDadosBrutos((prev) => [...prev, novaCaixa]);
      setForcarAtualizacao((prev) => !prev);
    });
    return () => socket.off("novaCaixa");
  }, []);

  useEffect(() => {
    const horas = gerarHoras();
    const filtrados = dadosBrutos.filter(
      (caixa) =>
        formatarDataLocal(new Date(caixa.created_at)) === dataSelecionada
    );

    const contagem = Object.fromEntries(horas.map((h) => [h, 0]));
    filtrados.forEach((item) => {
      const h = `${new Date(item.created_at)
        .getHours()
        .toString()
        .padStart(2, "0")}h`;
      if (contagem[h] !== undefined) contagem[h]++;
    });

    const formatados = horas.map((hora) => ({ hora, pacotes: contagem[hora] }));

    const total = filtrados.length;
    const media = +(total / horas.length).toFixed(1);

    const maiores = formatados.filter((item) => item.pacotes > 0);
    const pico = maiores.length
      ? maiores.reduce((a, b) => (b.pacotes > a.pacotes ? b : a))
      : { pacotes: 0, hora: "--" };

      
    const menores = formatados.filter((item) => item.pacotes > 0);
    const menor = menores.length
      ? menores.reduce((a, b) => (b.pacotes < a.pacotes ? b : a))
      : { pacotes: 0, hora: "--" };

    setDadosPorHora(formatados);
    setEstatisticas({ total, media, pico, menor });
  }, [dadosBrutos, dataSelecionada, forcarAtualizacao]);

  return (
    <div className={styles.container}>
      <DataSelector
        dataSelecionada={dataSelecionada}
        onChange={setDataSelecionada}
      />
      <div className={styles.cardsGrid}>
        <StatsCard
          title="Total de Pacotes"
          value={estatisticas.total}
          description=""
        />
        <StatsCard
          title="Média por Hora"
          value={estatisticas.media}
          description=""
        />
        <StatsCard
          title="Pico de Envio"
          value={`${estatisticas.pico?.pacotes} às ${estatisticas.pico?.hora}`}
          description=""
        />
        <StatsCard
          title="Menor Volume"
          value={`${estatisticas.menor?.pacotes} às ${estatisticas.menor?.hora}`}
          description=""
        />
      </div>
      <PacotesBarChart dadosPorHora={dadosPorHora} />
    </div>
  );
};
