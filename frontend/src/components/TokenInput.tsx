import { useState } from "react";

interface TokenInputProps {
  onConnect: (token: string) => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export default function TokenInput({
  onConnect,
  errorMessage,
  isLoading = false,
}: TokenInputProps) {
  const [token, setToken] = useState("");
  const [localError, setLocalError] = useState("");

  const displayError = errorMessage || localError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();

    if (!trimmed) {
      setLocalError("Por favor, insira seu token de acesso.");
      return;
    }

    setLocalError("");
    onConnect(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clean-gray px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <img
            src="/logo-intelbras.png"
            alt="Intelbras"
            className="h-10 mx-auto"
          />
          <p className="text-medium-gray mt-3 text-sm">
            Gerenciador de Dispositivos — Casa Inteligente
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-dark-gray mb-2">
            Conectar
          </h2>
          <p className="text-medium-gray text-sm mb-6">
            Insira seu token de acesso gerado na plataforma Open Casa
            Inteligente.
          </p>

          {/* Error message */}
          {displayError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-error text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
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
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-dark-gray mb-1"
              >
                Token de acesso
              </label>
              <input
                id="token"
                type="password"
                className="input-field"
                placeholder="Cole seu token aqui..."
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (localError) setLocalError("");
                }}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verificando token...
                </>
              ) : (
                "Conectar"
              )}
            </button>
          </form>

          <p className="text-xs text-medium-gray mt-4 text-center">
            O token não será armazenado permanentemente. Ele é usado apenas
            durante esta sessão.
          </p>
        </div>
      </div>
    </div>
  );
}
