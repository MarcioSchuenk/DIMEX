import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./styles.module.scss";
import { Outlet } from "react-router-dom";

export const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        {children}
        <Outlet />
      </main>
    </div>
  );
};
