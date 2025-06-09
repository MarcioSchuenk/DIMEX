import styles from "./styles.module.scss";

export const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};
