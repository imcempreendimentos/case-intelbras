interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onDisconnect?: () => void;
  isAuthError?: boolean;
}

export default function ErrorState({
  message,
  onRetry,
  onDisconnect,
  isAuthError = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-dark-gray mb-2">
        Ops! Algo deu errado
      </h3>
      <p className="text-medium-gray max-w-sm mb-6">{message}</p>

      {/* Actions */}
      <div className="flex gap-3">
        {isAuthError && onDisconnect && (
          <button onClick={onDisconnect} className="btn-primary">
            Reconectar
          </button>
        )}
        {onRetry && !isAuthError && (
          <button onClick={onRetry} className="btn-primary">
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
