export interface Sobras_Interface {
    codigo: string;
    data: Date;
    quantidade: number;
    pedido_cancelado: boolean;
    description: string;
    localizacao: string;
    created_at: Date;
    updated_at: Date;
}


export interface FiltroSobras {
    data?: string;
    codigoProduto?: string;
}