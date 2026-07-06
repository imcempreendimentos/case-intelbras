# Case Técnico Intelbras — Gerenciador de Dispositivos IoT

Aplicação web fullstack para visualização e gerenciamento de dispositivos da plataforma **Intelbras Casa Inteligente**.

## 🎯 Requisitos Atendidos

| Req | Descrição | Status |
|-----|-----------|--------|
| RF01 | Tela de autenticação (token) | ✅ |
| RF02 | Listagem de dispositivos | ✅ |
| RF03 | Filtro por origem (vinculado/compartilhado) | ✅ |
| RF04 | Paginação | ✅ |
| RF05 | Tratamento de erros | ✅ |
| RF06 | Detalhes do dispositivo (drawer) | ✅ |
| RF07 | Busca por nome/modelo | ✅ |
| RF08 | Indicadores de status (online/offline) | ✅ |

## 🛠 Stack Escolhida

### Backend
- **Python 3.12 + FastAPI** — Framework moderno, tipado, alta performance
- **httpx** — Cliente HTTP async para proxy das requisições
- **Pydantic v2** — Validação robusta de dados e settings

### Frontend
- **React 18 + TypeScript** — UI component-based com tipagem forte
- **Vite** — Build tool rápido com HMR
- **Tailwind CSS** — Utility-first CSS com tokens do Design System Intelbras
- **TanStack Query (React Query)** — Cache, loading states, retry automático
- **Axios** — Cliente HTTP com interceptors

### Justificativa
- **FastAPI como proxy**: Isola o frontend do endpoint Intelbras, permitindo CORS controlado, tratamento de erros padronizado e filtragem server-side.
- **React Query**: Gerencia cache dos dados, evita re-fetches desnecessários, e fornece estados de loading/error nativos.
- **Tailwind CSS**: Implementa rapidamente o Design System sem criar CSS customizado extenso.

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd backend

# Virtual environment
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Copiar env
cp .env.example .env

# Executar
uvicorn app.main:app --reload --port 8000
```

Acesse: http://localhost:8000/health

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar
npm run dev
```

Acesse: http://localhost:5173

> O Vite já está configurado para proxy `/api/*` → `localhost:8000`.

## 📁 Estrutura do Projeto

```
case-intelbras/
├── backend/
│   ├── app/
│   │   ├── main.py           # App FastAPI + CORS
│   │   ├── config.py         # Configurações via env
│   │   ├── schemas.py        # Modelos Pydantic
│   │   ├── routers/
│   │   │   └── devices.py    # POST /api/devices
│   │   └── services/
│   │       └── intelbras.py  # Client HTTP Intelbras
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # 10 componentes React
│   │   ├── hooks/            # useDevices (React Query)
│   │   ├── services/         # API client (Axios)
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Orquestrador principal
│   │   └── main.tsx          # Entry point
│   ├── tailwind.config.ts    # Design System Intelbras
│   └── vercel.json           # Deploy config
└── README.md
```

## 🎨 Design System

Implementação fiel ao Design System Intelbras:
- **Cores**: Primary (#00B26B), Dark (#00852b), badges de status
- **Tipografia**: Nunito Sans + Inter
- **Componentes**: Botões pill, cards com shadow, inputs com border-radius 6px
- **Responsivo**: Mobile-first com grid adaptativo

## 🔒 Segurança

- Token armazenado apenas em `sessionStorage` (limpo ao fechar aba)
- Nenhuma credencial no código-fonte
- Backend faz proxy seguro sem expor endpoints internos
- CORS restrito a origens permitidas

## 📋 Decisões Técnicas

1. **Proxy backend**: A API Intelbras não suporta CORS para SPAs. O backend atua como proxy, adicionando tratamento de erros padronizado.
2. **Filtragem por origem no backend**: A API não suporta nativamente este filtro, então é aplicado server-side.
3. **Busca local por texto**: Como o dataset por página é pequeno (10 itens), o filtro por nome/modelo é aplicado client-side para UX mais rápida.
4. **React Query**: Evita refetch desnecessário, cache inteligente com `staleTime: 30s`.
5. **Drawer para detalhes (RF06)**: Padrão UX que mantém contexto da lista sem navegação.

## 📸 Screenshots

> _Screenshots serão adicionados após deploy._

## 🌐 Demo

- **Frontend**: (URL Vercel após deploy)
- **Backend**: (URL Render após deploy)
