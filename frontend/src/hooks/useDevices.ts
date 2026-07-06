import { useQuery } from "@tanstack/react-query";
import { fetchDevices } from "../services/api";
import type { DeviceListResponse, OrigemFilter } from "../types/device";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/device";

interface UseDevicesParams {
  token: string;
  pagina: number;
  tamanhoPagina: number;
  origem: OrigemFilter;
}

export function useDevices({
  token,
  pagina,
  tamanhoPagina,
  origem,
}: UseDevicesParams) {
  return useQuery<DeviceListResponse, AxiosError<ApiError>>({
    queryKey: ["devices", token, pagina, tamanhoPagina, origem],
    queryFn: () =>
      fetchDevices({ token, pagina, tamanhoPagina, origem }),
    enabled: !!token,
    retry: false,
    staleTime: 30_000,
    refetchInterval: 30_000, // RF12: polling a cada 30s
  });
}

export function getErrorMessage(error: AxiosError<ApiError> | null): string {
  if (!error) return "";

  const detail = error.response?.data;

  if (detail?.mensagem) return detail.mensagem;

  if (error.code === "ERR_NETWORK") {
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }

  if (error.response?.status === 401) {
    return "Token inválido ou não fornecido. Verifique suas credenciais.";
  }

  if (error.response?.status === 403) {
    return "Seu token expirou. Faça login novamente.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
