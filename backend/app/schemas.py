from pydantic import BaseModel
from typing import Optional


class Device(BaseModel):
    """Modelo de dispositivo retornado pela API Intelbras."""

    id: Optional[str] = None
    nome: Optional[str] = None
    modelo: Optional[str] = None
    serial: Optional[str] = None
    mac: Optional[str] = None
    firmware: Optional[str] = None
    status: Optional[str] = None
    online: Optional[bool] = None
    origem: Optional[str] = None
    ultima_vez_online: Optional[str] = None
    categoria: Optional[str] = None
    tipo: Optional[str] = None
    ip: Optional[str] = None

    class Config:
        extra = "allow"


class PaginationMeta(BaseModel):
    """Metadados de paginação."""

    pagina: int
    tamanho_pagina: int
    total_registros: int
    total_paginas: int


class DeviceListResponse(BaseModel):
    """Resposta da listagem de dispositivos."""

    dispositivos: list[Device]
    paginacao: PaginationMeta


class ErrorResponse(BaseModel):
    """Resposta de erro padronizada."""

    erro: str
    mensagem: str
    codigo: int
