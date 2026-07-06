import type { Device } from "../types/device";

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (ns: string) => void;
}

export default function DeviceCard({
  device,
  onClick,
  isFavorite,
  onToggleFavorite,
}: DeviceCardProps) {
  const isOnline = device.online;

  return (
    <div className="card w-full text-left relative hover:shadow-card-hover transition-all duration-200">
      {/* Favorite Star (RF13) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(device.ns);
        }}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-yellow-50 transition-colors z-10"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorite}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${isFavorite ? "text-yellow-500" : "text-gray-300"}`}
          fill={isFavorite ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={isFavorite ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      {/* Main clickable area */}
      <button
        onClick={onClick}
        className="w-full text-left cursor-pointer focus:outline-none focus:ring-2
                   focus:ring-primary focus:ring-offset-2 rounded-card"
        aria-label={`Detalhes de ${device.nome || "Dispositivo"}`}
      >
        <div className="flex items-start justify-between gap-3 pr-8">
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
            <span className="text-xs text-medium-gray">v{device.versao}</span>
          )}
          {/* Firmware update badge (RF14) */}
          {device.atualizacao_disponivel && (
            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
              ⬆ Update
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
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
