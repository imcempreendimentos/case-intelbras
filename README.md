# Case Técnico Intelbras: Gerenciador de Dispositivos IoT

Aplicação web fullstack para visualização e gerenciamento de dispositivos da plataforma Intelbras Casa Inteligente.

## Demo

- **Frontend**: https://frontend-xi-livid-19.vercel.app
- **Backend**: https://backend-eta-taupe-82.vercel.app

## Stack

**Backend:** Python 3.12, FastAPI, httpx, Pydantic v2

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios

**Deploy:** Vercel (frontend + backend serverless)

## Funcionalidades Implementadas

| RF | Feature |
|----|---------|
| RF01 | Tela de autenticação com token |
| RF02 | Listagem de dispositivos |
| RF03 | Filtro por origem |
| RF04 | Paginação local |
| RF05 | Tratamento de erros em pt-BR |
| RF06 | Detalhes do dispositivo (drawer) |
| RF07 | Busca por nome/modelo |
| RF08 | Badges de status online/offline |
| RF09 | Ordenação por 7 critérios |
| RF11 | Exportação CSV |
| RF12 | Refresh automático (30s) |
| RF13 | Favoritar dispositivos |
| RF14 | Badge de atualização de firmware |
| RF16 | Dashboard com métricas |
| RF17 | Persistência de preferências |

## Como rodar localmente

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite faz proxy de `/api/*` para `localhost:8000`.

## Estrutura

```
case-intelbras/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routers/devices.py
│   │   └── services/intelbras.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   └── tailwind.config.ts
├── tests/e2e.spec.ts
└── docs/
    ├── BLOCO_A_PRODUTO_PROCESSO.md
    └── BLOCO_B_ARQUITETURA_AWS.md
```

## Decisões Técnicas

1. **FastAPI como proxy**: a API Intelbras não suporta CORS. O backend resolve isso e padroniza erros.
2. **Filtragem server-side**: o endpoint não filtra por origem nativamente, fazemos no backend.
3. **Paginação local**: o dataset é pequeno (10 devices), paginamos no client.
4. **React Query**: cache com staleTime 30s + polling automático.
5. **Design System Intelbras**: cores, tipografia e componentes fiéis ao site oficial.

## Segurança

- Token em sessionStorage (limpo ao fechar)
- Zero credenciais no código
- CORS restrito
- Security headers (X-Frame-Options, CSP, HSTS)
- Testes E2E com Playwright (17 cenários)
