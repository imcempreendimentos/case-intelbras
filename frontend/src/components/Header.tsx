interface HeaderProps {
  onDisconnect: () => void;
}

export default function Header({ onDisconnect }: HeaderProps) {
  return (
    <header className="bg-white shadow-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-intelbras.png"
              alt="Intelbras"
              className="h-7"
            />
            <span className="hidden sm:inline text-sm text-medium-gray">
              Gerenciador de Dispositivos
            </span>
          </div>

          {/* Disconnect button */}
          <button
            onClick={onDisconnect}
            className="text-sm text-medium-gray hover:text-error transition-colors
                       flex items-center gap-1.5 px-3 py-2 rounded-full
                       hover:bg-red-50"
            aria-label="Desconectar"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Desconectar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
