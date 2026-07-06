import { useState, useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./components/Header";
import TokenInput from "./components/TokenInput";
import FilterBar from "./components/FilterBar";
import DashboardSummary from "./components/DashboardSummary";
import DeviceList from "./components/DeviceList";
import DeviceDrawer from "./components/DeviceDrawer";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { useDevices, getErrorMessage } from "./hooks/useDevices";
import { usePreferences } from "./hooks/usePreferences";
import { useFavorites } from "./hooks/useFavorites";
import { exportDevicesToCSV } from "./utils/exportCSV";
import type { Device, OrigemFilter, StatusFilter } from "./types/device";
import type { SortOption } from "./hooks/usePreferences";

export default function App() {
  const queryClient = useQueryClient();

  // Auth state
  const [token, setToken] = useState<string>(
    () => sessionStorage.getItem("intelbras_token") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!sessionStorage.getItem("intelbras_token")
  );
  const [isValidating, setIsValidating] = useState(false);
  const [authError, setAuthError] = useState("");

  // Preferences (RF17)
  const { preferences, updatePreference } = usePreferences();

  // Filters — initialized from preferences
  const [search, setSearch] = useState("");
  const [origem, setOrigem] = useState<OrigemFilter>(preferences.origem);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    preferences.statusFilter
  );
  const [sortOption, setSortOption] = useState<SortOption>(
    preferences.sortOption
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterUpdatesOnly, setFilterUpdatesOnly] = useState(false);

  // Favorites (RF13)
  const { isFavorite, toggleFavorite } = useFavorites();

  // Pagination
  const [pagina, setPagina] = useState(1);
  const tamanhoPagina = 10;

  // Drawer
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // RF12: Track last update time
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Fetch devices (RF12: polling via refetchInterval in hook)
  const { data, isLoading, isFetching, error, refetch, dataUpdatedAt } = useDevices({
    token: isAuthenticated ? token : "",
    pagina,
    tamanhoPagina,
    origem,
  });

  // RF12: Update lastUpdated when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // RF12: Seconds counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Sorting function (RF09)
  const sortDevices = useCallback(
    (devices: Device[]): Device[] => {
      const sorted = [...devices];
      switch (sortOption) {
        case "nome-asc":
          return sorted.sort((a, b) =>
            (a.nome || "").localeCompare(b.nome || "", "pt-BR")
          );
        case "nome-desc":
          return sorted.sort((a, b) =>
            (b.nome || "").localeCompare(a.nome || "", "pt-BR")
          );
        case "status-online":
          return sorted.sort((a, b) =>
            a.online === b.online ? 0 : a.online ? -1 : 1
          );
        case "status-offline":
          return sorted.sort((a, b) =>
            a.online === b.online ? 0 : a.online ? 1 : -1
          );
        case "ultima-online-desc":
          return sorted.sort((a, b) =>
            (b.ultima_vez_online || "").localeCompare(
              a.ultima_vez_online || ""
            )
          );
        case "ultima-online-asc":
          return sorted.sort((a, b) =>
            (a.ultima_vez_online || "").localeCompare(
              b.ultima_vez_online || ""
            )
          );
        case "modelo-asc":
          return sorted.sort((a, b) =>
            (a.modelo || "").localeCompare(b.modelo || "", "pt-BR")
          );
        default:
          return sorted;
      }
    },
    [sortOption]
  );

  // Local filtering + sorting + favorites
  const filteredDevices = useMemo(() => {
    if (!data?.dispositivos) return [];

    let devices = data.dispositivos;

    // Text search
    if (search.trim()) {
      const term = search.toLowerCase();
      devices = devices.filter(
        (d) =>
          (d.nome && d.nome.toLowerCase().includes(term)) ||
          (d.modelo && d.modelo.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== "todos") {
      devices = devices.filter((d) =>
        statusFilter === "online" ? d.online : !d.online
      );
    }

    // Updates filter (from dashboard click)
    if (filterUpdatesOnly) {
      devices = devices.filter((d) => d.atualizacao_disponivel);
    }

    // Favorites filter (RF13)
    if (showFavoritesOnly) {
      devices = devices.filter((d) => isFavorite(d.ns));
    }

    // Sort (RF09)
    devices = sortDevices(devices);

    // Favorites first (when not filtering only favorites)
    if (!showFavoritesOnly) {
      devices = [
        ...devices.filter((d) => isFavorite(d.ns)),
        ...devices.filter((d) => !isFavorite(d.ns)),
      ];
    }

    return devices;
  }, [
    data?.dispositivos,
    search,
    statusFilter,
    filterUpdatesOnly,
    showFavoritesOnly,
    sortDevices,
    isFavorite,
  ]);

  // Handlers
  const handleConnect = useCallback(async (inputToken: string) => {
    setIsValidating(true);
    setAuthError("");

    try {
      const response = await fetch("/api/devices?pagina=1&tamanhoPagina=1", {
        method: "POST",
        headers: {
          Authorization: inputToken,
        },
      });

      if (response.ok) {
        sessionStorage.setItem("intelbras_token", inputToken);
        setToken(inputToken);
        setIsAuthenticated(true);
        setPagina(1);
      } else {
        const data = await response.json().catch(() => null);
        const mensagem =
          data?.detail?.mensagem ||
          data?.mensagem ||
          "Token inválido ou expirado. Verifique suas credenciais.";
        setAuthError(mensagem);
      }
    } catch {
      setAuthError(
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    sessionStorage.removeItem("intelbras_token");
    setToken("");
    setIsAuthenticated(false);
    setSearch("");
    setOrigem("todos");
    setStatusFilter("todos");
    setPagina(1);
    setSelectedDevice(null);
    setAuthError("");
    setFilterUpdatesOnly(false);
    setShowFavoritesOnly(false);
    queryClient.clear();
  }, [queryClient]);

  const handleOrigemChange = useCallback(
    (value: OrigemFilter) => {
      setOrigem(value);
      setPagina(1);
      updatePreference("origem", value);
    },
    [updatePreference]
  );

  const handleStatusFilterChange = useCallback(
    (value: StatusFilter) => {
      setStatusFilter(value);
      setFilterUpdatesOnly(false);
      updatePreference("statusFilter", value);
    },
    [updatePreference]
  );

  const handleSortChange = useCallback(
    (value: SortOption) => {
      setSortOption(value);
      updatePreference("sortOption", value);
    },
    [updatePreference]
  );

  const handleToggleFavorites = useCallback(() => {
    setShowFavoritesOnly((prev) => !prev);
  }, []);

  const handleExportCSV = useCallback(() => {
    exportDevicesToCSV(filteredDevices);
  }, [filteredDevices]);

  const handleDashboardFilterStatus = useCallback(
    (status: StatusFilter) => {
      setStatusFilter(status);
      setFilterUpdatesOnly(false);
      updatePreference("statusFilter", status);
    },
    [updatePreference]
  );

  const handleDashboardFilterUpdates = useCallback(() => {
    setFilterUpdatesOnly(true);
    setStatusFilter("todos");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagina(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // RF12: Manual refresh
  const handleManualRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Format seconds ago for display
  const formatSecondsAgo = (seconds: number): string => {
    if (seconds < 5) return "agora";
    if (seconds < 60) return `há ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `há ${minutes}min`;
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <TokenInput
        onConnect={handleConnect}
        errorMessage={authError}
        isLoading={isValidating}
      />
    );
  }

  // Auth expired
  const isAuthError =
    error?.response?.status === 401 || error?.response?.status === 403;

  if (isAuthError) {
    return (
      <TokenInput
        onConnect={handleConnect}
        errorMessage="Seu token expirou. Insira um novo token para continuar."
        isLoading={isValidating}
      />
    );
  }

  return (
    <div className="min-h-screen bg-clean-gray">
      <Header onDisconnect={handleDisconnect} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Summary (RF16) — above filters */}
        {data?.dispositivos && data.dispositivos.length > 0 && (
          <DashboardSummary
            devices={data.dispositivos}
            onFilterStatus={handleDashboardFilterStatus}
            onFilterUpdates={handleDashboardFilterUpdates}
          />
        )}

        {/* Filters (RF09, RF11, RF13) */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          origem={origem}
          onOrigemChange={handleOrigemChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={handleToggleFavorites}
          onExportCSV={handleExportCSV}
        />

        {/* Content */}
        {isLoading && <LoadingState />}

        {error && !isAuthError && (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && filteredDevices.length === 0 && <EmptyState />}

        {!isLoading && !error && filteredDevices.length > 0 && (
          <>
            {/* Results count + RF12 indicators */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-sm text-medium-gray">
                {data?.paginacao.total_registros ?? 0} dispositivo(s)
                encontrado(s)
                {search && ` • ${filteredDevices.length} com filtro local`}
                {filterUpdatesOnly && " • Filtro: atualizações pendentes"}
              </p>

              {/* RF12: Last updated indicator + refresh button */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-medium-gray">
                  {isFetching ? "Atualizando..." : `Atualizado ${formatSecondsAgo(secondsAgo)}`}
                </span>
                <button
                  onClick={handleManualRefresh}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Atualizar dados"
                  title="Atualizar dados"
                  disabled={isFetching}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-medium-gray ${isFetching ? "animate-spin" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <DeviceList
              devices={filteredDevices}
              onDeviceClick={setSelectedDevice}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />

            <Pagination
              pagina={pagina}
              totalPaginas={data?.paginacao.total_paginas ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* Device Detail Drawer */}
      <DeviceDrawer
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
}
