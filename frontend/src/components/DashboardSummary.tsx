import type { Device, StatusFilter } from "../types/device";

interface DashboardSummaryProps {
  devices: Device[];
  onFilterStatus: (status: StatusFilter) => void;
  onFilterUpdates: () => void;
}

export default function DashboardSummary({
  devices,
  onFilterStatus,
  onFilterUpdates,
}: DashboardSummaryProps) {
  const total = devices.length;
  const online = devices.filter((d) => d.online).length;
  const offline = total - online;
  const pendingUpdates = devices.filter((d) => d.atualizacao_disponivel).length;

  const onlinePercent = total > 0 ? Math.round((online / total) * 100) : 0;
  const offlinePercent = total > 0 ? Math.round((offline / total) * 100) : 0;

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      aria-label="Resumo dos dispositivos"
    >
      {/* Total */}
      <button
        onClick={() => onFilterStatus("todos")}
        className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition-all cursor-pointer text-left"
        aria-label={`Total: ${total} dispositivos. Clique para mostrar todos`}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-dark-gray">{total}</p>
          <p className="text-xs text-medium-gray">Total</p>
        </div>
      </button>

      {/* Online */}
      <button
        onClick={() => onFilterStatus("online")}
        className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition-all cursor-pointer text-left"
        aria-label={`${online} dispositivos online (${onlinePercent}%). Clique para filtrar`}
      >
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12v.01"
            />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-700">
            {online}
            <span className="text-sm font-normal text-medium-gray ml-1">
              ({onlinePercent}%)
            </span>
          </p>
          <p className="text-xs text-medium-gray">Online</p>
        </div>
      </button>

      {/* Offline */}
      <button
        onClick={() => onFilterStatus("offline")}
        className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition-all cursor-pointer text-left"
        aria-label={`${offline} dispositivos offline (${offlinePercent}%). Clique para filtrar`}
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M12 12v.01"
            />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-600">
            {offline}
            <span className="text-sm font-normal text-medium-gray ml-1">
              ({offlinePercent}%)
            </span>
          </p>
          <p className="text-xs text-medium-gray">Offline</p>
        </div>
      </button>

      {/* Pending Updates */}
      <button
        onClick={onFilterUpdates}
        className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition-all cursor-pointer text-left"
        aria-label={`${pendingUpdates} atualizações pendentes. Clique para filtrar`}
      >
        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-700">{pendingUpdates}</p>
          <p className="text-xs text-medium-gray">Atualizações</p>
        </div>
      </button>
    </div>
  );
}
