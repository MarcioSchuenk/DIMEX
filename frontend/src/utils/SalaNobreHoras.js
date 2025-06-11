export const gerarHoras = () => {
  const horas = [];
  for (let i = 8; i <= 21; i++) {
    horas.push(`${i.toString().padStart(2, "0")}h`);
  }
  return horas;
};

export const formatarDataLocal = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};
