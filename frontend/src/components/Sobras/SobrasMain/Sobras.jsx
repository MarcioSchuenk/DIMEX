import { useState } from "react";
import { DataSelector } from "../../../components/SalaNobre/DataSelector/DataSelector";
import { CodigoSelector } from "../CodigoSelector/CodSelector";
import { Modal } from "../Modal/modal";
import api from "../../../services/api";
import styles from "./styles.module.scss";

export const Sobras = () => {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [sobras, setSobras] = useState([]);
  const [sobraSelecionada, setSobraSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const res = await api.get("/sobras", {
        params: {
          data: dataSelecionada,
          codigoProduto: codigoProduto,
        },
      });
      setSobras(res.data);
    } catch (error) {
      console.error("Erro ao buscar sobras:", error);
      setErro("Erro ao buscar sobras. Por favor, tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (sobra) => {
    setSobraSelecionada(sobra);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setSobraSelecionada(null);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.selectorsContainer}>
          <DataSelector
            dataSelecionada={dataSelecionada}
            onChange={setDataSelecionada}
            className={styles.dataSelector}
          />

          <CodigoSelector
            codigoProduto={codigoProduto}
            onChange={setCodigoProduto}
            className={styles.codigoSelector}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={carregando}
        >
          {carregando ? "Pesquisando..." : "Pesquisar"}
        </button>

        {erro && <p className={styles.erro}>{erro}</p>}
      </form>

      {/* Exibição dos resultados */}
      <div className={styles.resultsContainer}>
        {sobras.length > 0 ? (
          <ul className={styles.sobrasList}>
            {sobras.map((sobra, index) => (
              <li 
                key={index} 
                className={styles.sobraCard}
                onClick={() => abrirModal(sobra)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.codigo}>{sobra.codigo}</span>
                  <span className={styles.quantidade}>{sobra.quantidade} un</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.localizacao}>{sobra.localizacao}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !carregando && <p className={styles.semResultados}>Nenhuma sobra encontrada</p>
        )}
      </div>

      {/* Modal de detalhes */}
      {modalAberto && sobraSelecionada && (
        <Modal isOpen={modalAberto} onClose={fecharModal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Detalhes da Sobra</h2>
            
            <div className={styles.detalhesContainer}>
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Código:</span>
                <span className={styles.detalheValor}>{sobraSelecionada.codigo}</span>
              </div>
              
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Quantidade:</span>
                <span className={styles.detalheValor}>{sobraSelecionada.quantidade} unidades</span>
              </div>
              
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Cancelado:</span>
                <span className={styles.detalheValor}>
                  {sobraSelecionada.pedido_cancelado ? "Sim" : "Não"}
                </span>
              </div>
              
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Localização:</span>
                <span className={styles.detalheValor}>{sobraSelecionada.localizacao}</span>
              </div>
              
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Onde Qual:</span>
                <span className={styles.detalheValor}>{sobraSelecionada.onde_qual}</span>
              </div>
              
              <div className={styles.detalheItem}>
                <span className={styles.detalheLabel}>Descrição:</span>
                <span className={styles.detalheValor}>{sobraSelecionada.description}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};