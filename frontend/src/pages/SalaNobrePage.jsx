
import { SalaNobre } from "../components/SalaNobre/SalaNobreMain/SalaNobre";
import { useAuth } from "../context/AuthContext";

export const SalaNobrePage = () => {
  const { role } = useAuth();

  return (
    <>
        {role === "admin" ? <SalaNobre /> : ""}
    </>
  );
};

