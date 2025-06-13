
import styles from "./styles.module.scss"; 
export const CodigoSelector = ({ codigoProduto, onChange }) => (
  <div>
    <input
      type="text"
      id="codigoProduto"
      name="codigoProduto"
      placeholder="EX: 00-0000"
      value={codigoProduto}
      onChange={(e) => onChange(e.target.value)}
      maxLength={20}
      className={styles.inputCodigo}
    />
  </div>
);
