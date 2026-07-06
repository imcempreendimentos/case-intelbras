export interface Device {
  ns: string;
  nome: string;
  modelo: string;
  status: string;
  online: boolean;
  versao: string;
  origem: string;
  subdispositivo: boolean;
  id_produto: string;
  ultima_vez_online: string;
  dispositivo_pai: string | null;
  id_produto_dispositivo_pai: string | null;
  atualizacao_disponivel: boolean;
}

export interface PaginationMeta {
  pagina: number;
  tamanho_pagina: number;
  total_registros: number;
  total_paginas: number;
}

export interface DeviceListResponse {
  dispositivos: Device[];
  paginacao: PaginationMeta;
}

export interface ApiError {
  erro: string;
  mensagem: string;
  codigo: number;
}

export type OrigemFilter = "todos" | "vinculado" | "compartilhado";
export type StatusFilter = "todos" | "online" | "offline";
