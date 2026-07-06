import type { Device } from "../types/device";

/**
 * Gera e faz download de um CSV com os dispositivos fornecidos.
 * Colunas: Nome, Modelo, Status, Versão, Origem, Última vez online, Subdispositivo, NS
 */
export function exportDevicesToCSV(devices: Device[]): void {
  const headers = [
    "Nome",
    "Modelo",
    "Status",
    "Versão",
    "Origem",
    "Última vez online",
    "Subdispositivo",
    "NS",
  ];

  const rows = devices.map((d) => [
    escapeCsvField(d.nome || ""),
    escapeCsvField(d.modelo || ""),
    d.online ? "Online" : "Offline",
    escapeCsvField(d.versao || ""),
    escapeCsvField(d.origem || ""),
    escapeCsvField(d.ultima_vez_online || ""),
    d.subdispositivo ? "Sim" : "Não",
    escapeCsvField(d.ns || ""),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dispositivos_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
