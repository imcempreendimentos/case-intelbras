import axios from "axios";
import type { DeviceListResponse, OrigemFilter } from "../types/device";

const api = axios.create({
  baseURL: "/api",
});

export interface FetchDevicesParams {
  token: string;
  pagina?: number;
  tamanhoPagina?: number;
  origem?: OrigemFilter;
}

export async function fetchDevices({
  token,
  pagina = 1,
  tamanhoPagina = 10,
  origem,
}: FetchDevicesParams): Promise<DeviceListResponse> {
  const params: Record<string, string | number> = {
    pagina,
    tamanhoPagina,
  };

  if (origem && origem !== "todos") {
    params.origem = origem;
  }

  const response = await api.post<DeviceListResponse>("/devices", null, {
    params,
    headers: {
      Authorization: token,
    },
  });

  return response.data;
}
