import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.scss";

export const LoginForm = () => {
  const { login: fazerLogin } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await fazerLogin({ login, password });
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <div>
        <label htmlFor="login">Usuário</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
};
