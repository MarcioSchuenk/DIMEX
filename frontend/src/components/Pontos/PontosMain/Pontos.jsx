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
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const dataFormatada = (data) => {
    const dataFormat = data.split("-").reverse().join("/");
    return dataFormat;
  };

  const buscarDados = async (paginaAtual = 1) => {
    setCarregando(true);
    try {
      const params = {
        dataInicio: dataFormatada(dataInicio),
        dataFim: dataFormatada(dataFim),
        nome: nome || "",
        pagina: paginaAtual,
        limite: 15,
      };
      if (filtrarAtrasos) {
        params.filtrarAtrasos = true;
      }

      const res = await api.get("https://2c80ba0d68a4.ngrok-free.app/pontos", {
        params,
      });

      setDados(res.data.dados);
      setTotalPaginas(res.data.totalPaginas);
      setPagina(res.data.pagina);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      buscarDados(1);
    })


  };

  const handlePaginaChange = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      buscarDados(novaPagina);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.titulo}>Relatório de Pontos</h1>

        <form onSubmit={handleSubmit} className={styles.filtrosContainer}>
          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Início</label>
            <DataSelector 
              dataSelecionada={dataInicio}
              onChange={(dataInicio) => setDataInicio(dataInicio)}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Fim</label>
            <DataSelector 
              dataSelecionada={dataFim}
              onChange={(dataFim) => setDataFim(dataFim)}
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

          <button 
            type="submit" 
            className={styles.buscarBtn} 
            disabled={carregando}>
              
            {carregando ? "Buscando..." : "Buscar"}
        </button>
        </form>
      </header>

      <div className={styles.resultadosContainer}>
        {carregando ? (
          <div className={styles.carregando}>🔄 Buscando dados...</div>
        ) : dados.length > 0 ? (
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
                  {dados.map((pessoa, indexPessoa) => {
                    // Agrupar os pontos por data
                    const pontosPorData = pessoa.pontos.reduce((acc, ponto) => {
                      const data = ponto.dataJornada;
                      if (!acc[data]) acc[data] = [];
                      acc[data].push(ponto);
                      return acc;
                    }, {});

                    return Object.entries(pontosPorData).map(([data, pontosDoDia], indexData) => {
                      const pontosFormatados = Array.from({ length: 4 }).map((_, i) => {
                        const ponto = pontosDoDia[i];
                        if (!ponto) return "--:--";

                        const hora = String(ponto.Hora).padStart(2, "0");
                        const minuto = String(ponto.Minuto).padStart(2, "0");
                        const horario = `${hora}:${minuto}`;

                        if (ponto.atraso === true) {
                          return (
                            <span key={i} style={{ color: "red", fontWeight: "bold" }}>
                              {horario} ⚠️
                            </span>
                          );
                        }

                        return horario;
                      });

                      return (
                        <tr key={`${indexPessoa}-${indexData}`}>
                          <td>{pessoa.nome}</td>
                          <td>{data}</td>
                          <td>{pontosFormatados[0]}</td>
                          <td>{pontosFormatados[1]}</td>
                          <td>{pontosFormatados[2]}</td>
                          <td>{pontosFormatados[3]}</td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.paginacao}>
              <button
                onClick={() => handlePaginaChange(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </button>
              <span>
                Página {pagina} de {totalPaginas}
              </span>
              <button
                onClick={() => handlePaginaChange(pagina + 1)}
                disabled={pagina === totalPaginas}
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <div className={styles.semResultados}>
            <span style={{ color: "red", fontWeight: "bold" }}>⚠️ Nenhum resultado encontrado</span>
          </div>
        )}
      </div>
    </div>
  );
};
