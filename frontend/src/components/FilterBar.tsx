import type { OrigemFilter, StatusFilter } from "../types/device";
import type { SortOption } from "../hooks/usePreferences";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  origem: OrigemFilter;
  onOrigemChange: (value: OrigemFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onExportCSV: () => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  origem,
  onOrigemChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
  onExportCSV,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Row 1: Search + Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Favorites toggle */}
        <button
          onClick={onToggleFavorites}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-card border text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? "bg-yellow-50 border-yellow-300 text-yellow-700"
              : "border-light-gray text-medium-gray hover:bg-gray-50"
          }`}
          aria-label={showFavoritesOnly ? "Mostrar todos" : "Mostrar favoritos"}
          aria-pressed={showFavoritesOnly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={showFavoritesOnly ? "currentColor" : "none"}
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
          Favoritos
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-card border border-light-gray
                     text-sm font-medium text-medium-gray hover:bg-gray-50 transition-colors"
          aria-label="Exportar dispositivos visíveis como CSV"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Row 2: Filters + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
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
          onChange={(e) =>
            onStatusFilterChange(e.target.value as StatusFilter)
          }
          className="input-field sm:w-40"
          aria-label="Filtrar por status"
        >
          <option value="todos">Todos os status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        {/* Sort (RF09) */}
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="input-field sm:w-52"
          aria-label="Ordenar por"
        >
          <option value="nome-asc">Nome (A-Z)</option>
          <option value="nome-desc">Nome (Z-A)</option>
          <option value="status-online">Status (online primeiro)</option>
          <option value="status-offline">Status (offline primeiro)</option>
          <option value="ultima-online-desc">Última online (recente)</option>
          <option value="ultima-online-asc">Última online (antigo)</option>
          <option value="modelo-asc">Modelo (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
