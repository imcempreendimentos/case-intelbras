import type { Device } from "../types/device";

interface DeviceDrawerProps {
  device: Device | null;
  onClose: () => void;
}

export default function DeviceDrawer({ device, onClose }: DeviceDrawerProps) {
  if (!device) return null;

  const isOnline = device.online;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50
                   overflow-y-auto animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${device.nome || "dispositivo"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-gray truncate pr-4">
            Detalhes do Dispositivo
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-medium-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name & Status */}
          <div>
            <h3 className="text-xl font-bold text-dark-gray">
              {device.nome || "Dispositivo sem nome"}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                  isOnline
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? "bg-success" : "bg-light-gray"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="space-y-4">
            <DetailRow label="Modelo" value={device.modelo} />
            <DetailRow label="Serial" value={device.serial} />
            <DetailRow label="MAC" value={device.mac} />
            <DetailRow label="Firmware" value={device.firmware} />
            <DetailRow label="IP" value={device.ip} />
            <DetailRow label="Categoria" value={device.categoria} />
            <DetailRow label="Tipo" value={device.tipo} />
            <DetailRow label="Origem" value={device.origem} />
            <DetailRow
              label="Última vez online"
              value={
                device.ultima_vez_online
                  ? formatDate(device.ultima_vez_online)
                  : undefined
              }
            />
          </div>
        </div>
      </aside>
    </>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col">
      <span className="text-xs text-medium-gray uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-dark-gray font-medium mt-0.5 break-all">
        {value}
      </span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
