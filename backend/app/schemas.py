from typing import Optional

from pydantic import BaseModel


class Device(BaseModel):
    """Modelo de um dispositivo da API Intelbras."""

    ns: str = ""
    nome: str = ""
    modelo: str = ""
    status: str = ""
    online: bool = False
    versao: str = ""
    origem: str = ""
    subdispositivo: bool = False
    id_produto: str = ""
    ultima_vez_online: str = ""
    dispositivo_pai: Optional[str] = None
    id_produto_dispositivo_pai: Optional[str] = None
    atualizacao_disponivel: bool = False


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


class ApiErrorDetail(BaseModel):
    """Detalhe de erro da API."""

    erro: str
    mensagem: str
    codigo: int
