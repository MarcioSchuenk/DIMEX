import  { SettingsMain } from "../components/SettingsMain/SettingsMain";
import { useAuth } from "../context/AuthContext";

export const SettingsPage = () => {
  const { role } = useAuth();
  return role === "admin" ? <SettingsMain /> : null;
};
