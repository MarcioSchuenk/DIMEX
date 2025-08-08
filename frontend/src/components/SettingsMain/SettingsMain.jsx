import { useForm } from "react-hook-form";
import { registerUser } from "../../services/registerUser";

export const SettingsMain = () => {
  const {register, handleSubmit, formState: { errors }} = useForm({});

  const onSubmit = (data) => {

    registerUser(data);
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Nome</label>
        <input type="text" {...register("nome")} />
        {errors.nome && <p>{errors.nome.message}</p>}

        <label>E-mail</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        <label>Senha</label>
        <input type="password" {...register("password")} />
        {errors.senha && <p>{errors.senha.message}</p>}

        <label>Role</label>
        <input type="checkbox" id="admin" value={"admin"} {...register("role")} />
        <label for="admin">Admin</label>
        
        <input type="checkbox" id="monitoramento" value={"monitoramento"} {...register("role")} />
        <label for="admin" id="monitoramento ">Monitoramento</label>

        <input type="checkbox" value={"expedicao"} {...register("role")} />
        <label for="admin">Admin</label>

        <input type="checkbox" value={"dp"} {...register("role")} />
        <label for="admin">Admin</label>

        <input type="checkbox" value={"sac"} {...register("role")} />
        <label for="admin">Admin</label>

        <input type="checkbox" value={"ti"} {...register("role")} />
        <label for="admin">Admin</label>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
