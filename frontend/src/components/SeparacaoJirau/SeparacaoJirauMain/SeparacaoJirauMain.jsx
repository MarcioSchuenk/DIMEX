import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.scss";

const separacaoSchema = z.object({
  cracha: z
    .string()
    .length(6, "O campo crachá precisa ter 6 caracteres")
    .regex(/^\d+$/, "O campo crachá deve conter apenas números"),
  pedido: z
    .string()
    .length(7, "O campo pedido precisa ter 6 caracteres")
    .regex(/^\d+$/, "O campo pedido deve conter apenas números"),
});


export const SeparacaoJirauMain = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(separacaoSchema),
  });
  
  const onSubmit = (data) => {

    console.log(data);
  };

  return (
    <div>
      <h1 className="tittle3">Separação Jirau</h1>
      <p>Realize a separação dos pedidos utilizando o crachá e o número do pedido.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Bipe o crachá" {...register("cracha")} />
        {errors.cracha && <p>{errors.cracha.message}</p>}
    
        <input placeholder="Bipe o Pedido" {...register("pedido")} />
        {errors.pedido && <p>{errors.pedido.message}</p>}

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
