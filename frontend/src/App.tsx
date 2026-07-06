import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./components/Header";
import TokenInput from "./components/TokenInput";
import FilterBar from "./components/FilterBar";
import DeviceList from "./components/DeviceList";
import DeviceDrawer from "./components/DeviceDrawer";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { useDevices, getErrorMessage } from "./hooks/useDevices";
import type { Device, OrigemFilter, StatusFilter } from "./types/device";

export default function App() {
  const queryClient = useQueryClient();

  // Auth state
  const [token, setToken] = useState<string>(
    () => sessionStorage.getItem("intelbras_token") || ""
  );

  // Filters
  const [search, setSearch] = useState("");
  const [origem, setOrigem] = useState<OrigemFilter>("todos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  // Pagination
  const [pagina, setPagina] = useState(1);
  const tamanhoPagina = 10;

  // Drawer
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Fetch devices
  const { data, isLoading, error, refetch } = useDevices({
    token,
    pagina,
    tamanhoPagina,
    origem,
  });

  // Local filtering (search + status)
  const filteredDevices = useMemo(() => {
    if (!data?.dispositivos) return [];

    let devices = data.dispositivos;

    // Text search (local)
    if (search.trim()) {
      const term = search.toLowerCase();
      devices = devices.filter(
        (d) =>
          (d.nome && d.nome.toLowerCase().includes(term)) ||
          (d.modelo && d.modelo.toLowerCase().includes(term))
      );
    }

    // Status filter (local)
    if (statusFilter !== "todos") {
      devices = devices.filter((d) =>
        statusFilter === "online" ? d.online : !d.online
      );
    }

    return devices;
  }, [data?.dispositivos, search, statusFilter]);

  // Handlers
  const handleConnect = useCallback(
    (newToken: string) => {
      sessionStorage.setItem("intelbras_token", newToken);
      setToken(newToken);
      setPagina(1);
    },
    []
  );

  const handleDisconnect = useCallback(() => {
    sessionStorage.removeItem("intelbras_token");
    setToken("");
    setSearch("");
    setOrigem("todos");
    setStatusFilter("todos");
    setPagina(1);
    setSelectedDevice(null);
    queryClient.clear();
  }, [queryClient]);

  const handleOrigemChange = useCallback((value: OrigemFilter) => {
    setOrigem(value);
    setPagina(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagina(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // If no token, show login
  if (!token) {
    return <TokenInput onConnect={handleConnect} />;
  }

  const isAuthError =
    error?.response?.status === 401 || error?.response?.status === 403;

  return (
    <div className="min-h-screen bg-clean-gray">
      <Header onDisconnect={handleDisconnect} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          origem={origem}
          onOrigemChange={handleOrigemChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Content */}
        {isLoading && <LoadingState />}

        {error && (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
            onDisconnect={handleDisconnect}
            isAuthError={isAuthError}
          />
        )}

        {!isLoading && !error && filteredDevices.length === 0 && (
          <EmptyState />
        )}

        {!isLoading && !error && filteredDevices.length > 0 && (
          <>
            {/* Results count */}
            <p className="text-sm text-medium-gray mb-4">
              {data?.paginacao.total_registros ?? 0} dispositivo(s)
              encontrado(s)
              {search && ` • ${filteredDevices.length} com filtro local`}
            </p>

            <DeviceList
              devices={filteredDevices}
              onDeviceClick={setSelectedDevice}
            />

            <Pagination
              pagina={pagina}
              totalPaginas={data?.paginacao.total_paginas ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* Device Detail Drawer (RF06) */}
      <DeviceDrawer
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
}
