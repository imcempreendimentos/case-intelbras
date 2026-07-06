from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import devices

app = FastAPI(
    title="Case Intelbras - API",
    description="Backend proxy para a API Intelbras Casa Inteligente",
    version="1.0.0",
)

# CORS — Permite localhost:5173 e *.vercel.app
origins = list(settings.cors_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(devices.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "case-intelbras-api"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handler global para exceções não tratadas."""
    return JSONResponse(
        status_code=500,
        content={
            "erro": "erro_interno",
            "mensagem": "Ocorreu um erro inesperado. Tente novamente mais tarde.",
            "codigo": 500,
        },
    )
