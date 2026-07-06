export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-medium-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-dark-gray mb-2">
        Nenhum dispositivo encontrado
      </h3>
      <p className="text-medium-gray max-w-sm">
        Não encontramos dispositivos com os filtros aplicados. Tente
        ajustar os filtros ou verifique sua conta.
      </p>
    </div>
  );
}
