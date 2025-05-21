export type ServidorToCliente = {
  novaCaixa: (data: any) => void
}

export type ClienteToServidor = {
  pingCaixas: () => void
}