import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.scss";

const separacaoSchema = z.object({
  cracha: z.number().min(6, "O campo crachá invalido"),
  pedido: z.number().min(7, "O campo pedido invalido"),
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
        <input placeholder="Bipe o crachá" {...register("cracha", { valueAsNumber: true })} />
        {errors.cracha && <p>{errors.cracha.message}</p>}
    
        <input placeholder="Bipe o Pedido" {...register("pedido", { valueAsNumber: true })} />
        {errors.pedido && <p>{errors.pedido.message}</p>}

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
