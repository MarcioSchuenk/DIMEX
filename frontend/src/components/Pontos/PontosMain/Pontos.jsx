import { useState } from "react";
import styles from "./styles.module.scss";
import api from "../../../services/api";
import { DataSelector } from "../../SalaNobre/DataSelector/DataSelector";

export const RelatorioPontos = () => {
  const [dados, setDados] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nome, setNome] = useState("");
  const [filtrarAtrasos, setFiltrarAtrasos] = useState(false);

  const dataFormatada = (data) => {
    const dataFormat = data.split("-").reverse().join("/");
    return dataFormat;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const buscarDados = async () => {
      try {
        const params = {
          dataInicio,
          dataFim,
          nome: nome || "",
        };
        if (filtrarAtrasos) {
          params.filtrarAtrasos = true;
        }

        const res = await api.get("https://2092-200-225-228-145.ngrok-free.app/pontos", {
          params,
        });

        setDados(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    buscarDados();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.titulo}>Relatório de Pontos</h1>

        <form onSubmit={handleSubmit} className={styles.filtrosContainer}>
          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Início</label>
            <DataSelector 
              className={styles.input}
              dataSelecionada={dataInicio}
              onChange={(dataInicio) => setDataInicio(dataFormatada(dataInicio))}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Fim</label>
            <DataSelector 
              className={styles.input}
              dataSelecionada={dataFim}
              onChange={(dataFim) => setDataFim(dataFormatada(dataFim))}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>Nome</label>
            <input 
              type="text" 
              className={styles.inputText}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome"
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>
              <input 
                type="checkbox" 
                id="atrasos" 
                onChange={(e) => setFiltrarAtrasos(e.target.checked)}
              />
              Filtrar pelos atrasos
            </label>
          </div>

          <button type="submit" className={styles.buscarBtn}>Buscar</button>
        </form>
      </header>

      <div className={styles.resultadosContainer}>
        {dados.length > 0 ? (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Ponto 1</th>
                    <th>Ponto 2</th>
                    <th>Ponto 3</th>
                    <th>Ponto 4</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((pessoa, index) => {
                    const pontosFormatados = Array.from({ length: 4 }).map((_, i) => {
                      const ponto = pessoa.pontos[i];
                      if (!ponto) return "--:--";

                      const hora = String(ponto.Hora).padStart(2, "0");
                      const minuto = String(ponto.Minuto).padStart(2, "0");
                      return `${hora}:${minuto}`;
                    });

                    const pontoExemplo = pessoa.pontos[0];
                    const data = pontoExemplo
                      ? `${String(pontoExemplo.Dia).padStart(2, "0")}/${String(pontoExemplo.Mes).padStart(2, "0")}/${pontoExemplo.Ano}`
                      : "--/--/----";

                    return (
                      <tr key={index}>
                        <td>{pessoa.nome}</td>
                        <td>{data}</td>
                        <td>{pontosFormatados[0]}</td>
                        <td>{pontosFormatados[1]}</td>
                        <td>{pontosFormatados[2]}</td>
                        <td>{pontosFormatados[3]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className={styles.semResultados}>
            Nenhum resultado encontrado
          </div>
        )}
      </div>
    </div>
  );
};