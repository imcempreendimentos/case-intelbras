import type { Device } from "../types/device";

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

export default function DeviceCard({ device, onClick }: DeviceCardProps) {
  const isOnline = device.online;

  return (
    <button
      onClick={onClick}
      className="card w-full text-left cursor-pointer hover:shadow-card-hover
                 transition-all duration-200 focus:outline-none focus:ring-2
                 focus:ring-primary focus:ring-offset-2"
      aria-label={`Detalhes de ${device.nome || "Dispositivo"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Nome */}
          <h3 className="font-bold text-dark-gray truncate">
            {device.nome || "Dispositivo sem nome"}
          </h3>

          {/* Modelo */}
          <p className="text-sm text-medium-gray mt-0.5 truncate">
            {device.modelo || "Modelo não informado"}
          </p>

          {/* Última vez online */}
          {device.ultima_vez_online && (
            <p className="text-xs text-medium-gray mt-2">
              Última vez online:{" "}
              <span className="text-dark-gray">
                {formatDate(device.ultima_vez_online)}
              </span>
            </p>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            isOnline
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-success" : "bg-light-gray"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Origin badge + extras */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
        {device.origem && (
          <span className="text-xs bg-primary-light/20 text-primary-dark px-2 py-0.5 rounded-full">
            {device.origem}
          </span>
        )}
        {device.subdispositivo && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            subdispositivo
          </span>
        )}
        {device.versao && (
          <span className="text-xs text-medium-gray">
            v{device.versao}
          </span>
        )}
      </div>
    </button>
  );
}

function formatDate(dateStr: string): string {
  try {
    // Formato Intelbras: "20260625T170134Z" → "2026-06-25T17:01:34Z"
    if (/^\d{8}T\d{6}Z$/.test(dateStr)) {
      const formatted = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}Z`;
      const date = new Date(formatted);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
