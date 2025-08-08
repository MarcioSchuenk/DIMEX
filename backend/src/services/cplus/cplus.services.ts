import { prismaCplus } from "../../database/prisma";
import { injectable } from "tsyringe";

@injectable()
export class CplusServices {
  async buscarRomaneio() {
    const romaneio = await prismaCplus.romaneiodeentrega.findMany({
      select: {
        id: true,
        datadocadastro: true,
        observacoes: true,
        dataprevistasaida: true,
        pessoa_romaneiodeentrega_idmotoristaTopessoa: {
          select: { nome: true },
        },
        pessoa_romaneiodeentrega_idajudanteTopessoa: {
          select: { nome: true },
        },
        pessoa_romaneiodeentrega_idsegundoajudanteTopessoa: {
          select: { nome: true },
        },
        veiculo: {
          select: { placa: true },
        },
        pontodeparada: {
          select: {
            id: true,
            pessoa: {
              select: {
                nome: true,
              },
            },
            distancia: true,
            datadapartida: true,
            datadocheckin: true,
            datadocheckout: true,
          },
        },
      },
    });

    const romaneioFlat = romaneio.map((r) => ({
      id: r.id,
      datacadastro: r.datadocadastro,
      observacoes: r.observacoes,
      dataprevistasaida: r.dataprevistasaida,
      motorista: r.pessoa_romaneiodeentrega_idmotoristaTopessoa?.nome,
      veiculo: r.veiculo?.placa,
      ajudante: r.pessoa_romaneiodeentrega_idajudanteTopessoa?.nome,
      segundoAjudante:
      r.pessoa_romaneiodeentrega_idsegundoajudanteTopessoa?.nome,
      pontosdeparada: r.pontodeparada.map((p) => ({
        id: p.id,
        cliente: p.pessoa?.nome,
        distancia: p.distancia,
        datadapartida: p.datadapartida,
        datadocheckin: p.datadocheckin,
        datadocheckout: p.datadocheckout,
      })),
    }));

    return romaneioFlat;
  }
}
