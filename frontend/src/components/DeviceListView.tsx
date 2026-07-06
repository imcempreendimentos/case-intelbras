import type { Device } from "../types/device";

interface DeviceListViewProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  isFavorite: (ns: string) => boolean;
  onToggleFavorite: (ns: string) => void;
}

export default function DeviceListView({
  devices,
  onDeviceClick,
  isFavorite,
  onToggleFavorite,
}: DeviceListViewProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-gray-100 shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-clean-gray border-b border-gray-100">
          <tr>
            <th className="text-left p-3 font-semibold text-dark-gray w-8"></th>
            <th className="text-left p-3 font-semibold text-dark-gray">Nome</th>
            <th className="text-left p-3 font-semibold text-dark-gray hidden sm:table-cell">Modelo</th>
            <th className="text-left p-3 font-semibold text-dark-gray">Status</th>
            <th className="text-left p-3 font-semibold text-dark-gray hidden md:table-cell">Versão</th>
            <th className="text-left p-3 font-semibold text-dark-gray hidden lg:table-cell">Última Online</th>
            <th className="text-left p-3 font-semibold text-dark-gray hidden md:table-cell">Origem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {devices.map((device) => (
            <tr
              key={device.ns}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onDeviceClick(device)}
            >
              {/* Favorite */}
              <td className="p-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(device.ns);
                  }}
                  className="text-yellow-400 hover:scale-110 transition-transform"
                  aria-label={isFavorite(device.ns) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill={isFavorite(device.ns) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              </td>

              {/* Nome */}
              <td className="p-3">
                <div className="font-medium text-dark-gray">{device.nome || "Sem nome"}</div>
                <div className="text-xs text-medium-gray sm:hidden">{device.modelo}</div>
              </td>

              {/* Modelo */}
              <td className="p-3 text-medium-gray hidden sm:table-cell">
                {device.modelo}
              </td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    device.online
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      device.online ? "bg-success" : "bg-light-gray"
                    }`}
                  />
                  {device.online ? "Online" : "Offline"}
                </span>
                {device.atualizacao_disponivel && (
                  <span className="ml-1 text-xs text-yellow-600">⬆</span>
                )}
              </td>

              {/* Versão */}
              <td className="p-3 text-medium-gray text-xs hidden md:table-cell">
                {device.versao}
              </td>

              {/* Última Online */}
              <td className="p-3 text-medium-gray text-xs hidden lg:table-cell">
                {formatDate(device.ultima_vez_online)}
              </td>

              {/* Origem */}
              <td className="p-3 hidden md:table-cell">
                <span className="text-xs bg-primary-light/20 text-primary-dark px-2 py-0.5 rounded-full">
                  {device.origem}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    if (/^\d{8}T\d{6}Z$/.test(dateStr)) {
      const formatted = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}Z`;
      const date = new Date(formatted);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
