import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const LoginForm = () => {
  const { login: fazerLogin } = useAuth(); // pega a função login do contexto
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await fazerLogin({ login, password });

  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="login"></label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      </div>
      <div>
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
