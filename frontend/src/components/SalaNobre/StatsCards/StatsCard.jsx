import styles from "./styles.module.scss";

export const StatsCard = ({ title, value, description }) => {
  return (
    <div className={styles.stats_card}>
      <p className={styles.stats_card__header}>{title}</p>
      <p className={styles.stats_card__value}>{value}</p>
      {description && <p className={styles.stats_card__description}>{description}</p>}
    </div>
  );
};
