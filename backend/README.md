# Case Intelbras — Backend

Backend em Python/FastAPI que atua como proxy para a API Intelbras Casa Inteligente.

## Executar localmente

```bash
# Criar virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Instalar dependências
pip install -r requirements.txt

# Copiar variáveis de ambiente
cp .env.example .env

# Executar servidor
uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Método | Rota           | Descrição                    |
|--------|----------------|------------------------------|
| GET    | /health        | Health check                 |
| POST   | /api/devices   | Lista dispositivos (proxy)   |

## Docker

```bash
docker build -t case-intelbras-api .
docker run -p 8000:8000 case-intelbras-api
```
