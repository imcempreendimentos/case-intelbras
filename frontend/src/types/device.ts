export interface Device {
  id: string;
  nome: string;
  modelo: string;
  serial: string;
  mac: string;
  firmware: string;
  status: string;
  online: boolean;
  origem: string;
  ultima_vez_online: string;
  categoria: string;
  tipo: string;
  ip: string;
  [key: string]: unknown;
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
