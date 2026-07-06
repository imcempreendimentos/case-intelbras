import { useState } from "react";

interface TokenInputProps {
  onConnect: (token: string) => void;
  errorMessage?: string;
}

export default function TokenInput({ onConnect, errorMessage }: TokenInputProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(errorMessage || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();

    if (!trimmed) {
      setError("Por favor, insira seu token de acesso.");
      return;
    }

    setError("");
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
            Insira seu token de acesso da API Intelbras para visualizar seus
            dispositivos.
          </p>

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
                  if (error) setError("");
                }}
                autoComplete="off"
              />
              {error && (
                <p className="text-error text-sm mt-1">{error}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              Conectar
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
