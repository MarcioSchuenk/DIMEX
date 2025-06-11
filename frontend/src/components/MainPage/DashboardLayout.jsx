import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};
