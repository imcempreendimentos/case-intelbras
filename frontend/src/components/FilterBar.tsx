import type { OrigemFilter, StatusFilter } from "../types/device";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  origem: OrigemFilter;
  onOrigemChange: (value: OrigemFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  origem,
  onOrigemChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome ou modelo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
            aria-label="Buscar dispositivos"
          />
        </div>
      </div>

      {/* Origem filter */}
      <select
        value={origem}
        onChange={(e) => onOrigemChange(e.target.value as OrigemFilter)}
        className="input-field sm:w-48"
        aria-label="Filtrar por origem"
      >
        <option value="todos">Todas as origens</option>
        <option value="vinculado">Vinculados</option>
        <option value="compartilhado">Compartilhados</option>
      </select>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
        className="input-field sm:w-40"
        aria-label="Filtrar por status"
      >
        <option value="todos">Todos os status</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
    </div>
  );
}
