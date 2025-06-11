import styles from "./styles.module.scss";

export const DataSelector = ({ dataSelecionada, onChange}) => (
  <div className={styles.input_group}>
    <input
      type="date"
      value={dataSelecionada}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);


