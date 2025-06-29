import { useState } from "react";
import styles from "./styles.module.scss";
import api from "../../../services/api";

const RelatorioPontos = () => {
  const [dados, setDados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const fetchDados = async (paginaAtual = 1) => {
    if (!dataInicio || !dataFim) {
      alert("Preencha as datas de início e fim");
      return;
    }

    setCarregando(true);
    try {
      const response = await api.get("/pontos/", {
        params: {
          inicio: formatarData(dataInicio),
          fim: formatarData(dataFim),
          page: paginaAtual,
          limit: 10,
          nome: nomeFiltro || undefined,
        },
      });

      setDados(response.data.dados || []);
      setTotalPaginas(response.data.totalPaginas || 1);
      setPagina(paginaAtual);
      setFiltroAtivo(true);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleAnterior = () => {
    if (pagina > 1) fetchDados(pagina - 1);
  };

  const handleProxima = () => {
    if (pagina < totalPaginas) fetchDados(pagina + 1);
  };

  const isAtraso = (idx, ponto) => {
    if (idx !== 0) return false; // só verifica o primeiro ponto

    const { Hora, Minuto } = ponto;

    const faixaPermitida = [
      { hora: 7, inicio: 6, fim: 54 },
      { hora: 12, inicio: 6, fim: 54 },
      { hora: 14, inicio: 6, fim: 54 },
      { hora: 16, inicio: 6, fim: 54 },
    ];

    return faixaPermitida.some(
      (faixa) =>
        Hora === faixa.hora && Minuto >= faixa.inicio && Minuto <= faixa.fim
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Relatório de Pontos</h2>
        <div className={styles.filtrosContainer}>
          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.label}>Nome (opcional)</label>
            <input
              type="text"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
              placeholder="Digite um nome"
              className={styles.inputText}
            />
          </div>

          <button
            onClick={() => fetchDados(1)}
            className={styles.buscarBtn}
            disabled={carregando}
          >
            {carregando ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {filtroAtivo && (
        <div className={styles.resultadosContainer}>
          {dados.length === 0 ? (
            <div className={styles.semResultados}>
              Nenhum resultado encontrado para os filtros aplicados
            </div>
          ) : (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Data</th>
                      <th>Ponto Entrada</th>
                      <th>Ponto Almoço/Janta</th>
                      <th>Ponto Volta</th>
                      <th>Ponto Saida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((funcionario) =>
                      funcionario.pontos.map((ponto, index) => (
                        <tr key={`${funcionario.matricula}-${index}`}>
                          <td>{funcionario.nome}</td>
                          <td>{ponto.data}</td>
                          {ponto.marcacoes.slice(0, 4).map((m, idx) => {
                            const hora = String(m.Hora).padStart(2, "0");
                            const minuto = String(m.Minuto).padStart(2, "0");

                            const isAtrasado = isAtraso(idx, m);

                            return (
                              <td
                                key={idx}
                                style={{
                                  color: isAtrasado ? "red" : undefined,
                                  fontWeight: isAtrasado ? "bold" : undefined,
                                }}
                              >
                                {hora}:{minuto}
                                {isAtrasado ? " ⚠️" : ""}
                              </td>
                            );
                          })}
                          {[...Array(4 - ponto.marcacoes.length)].map(
                            (_, i) => (
                              <td key={`empty-${i}`}>--:--</td>
                            )
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.paginacao}>
                <button
                  onClick={handleAnterior}
                  disabled={pagina === 1 || carregando}
                  className={styles.paginacaoBtn}
                >
                  Anterior
                </button>
                <span className={styles.paginaInfo}>
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  onClick={handleProxima}
                  disabled={pagina === totalPaginas || carregando}
                  className={styles.paginacaoBtn}
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatorioPontos;
