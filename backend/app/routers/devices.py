from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Query

from app.schemas import Device, DeviceListResponse, PaginationMeta
from app.services.intelbras import listar_dispositivos

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.post("", response_model=DeviceListResponse)
async def list_devices(
    pagina: int = Query(default=1, ge=1, description="Número da página"),
    tamanhoPagina: int = Query(
        default=10, ge=1, le=100, alias="tamanhoPagina", description="Itens por página"
    ),
    origem: Optional[str] = Query(
        default=None,
        description="Filtro por origem: vinculado, compartilhado ou todos",
    ),
    authorization: Optional[str] = Header(default=None),
):
    """
    Lista dispositivos da API Intelbras com proxy de autenticação.

    - Repassa o token Authorization para a API Intelbras.
    - Suporta filtragem por origem (vinculado/compartilhado).
    - Suporta paginação.
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail={
                "erro": "nao_autorizado",
                "mensagem": "Token de autenticação não fornecido. Envie o header Authorization.",
                "codigo": 401,
            },
        )

    # Chama API Intelbras
    data = await listar_dispositivos(
        token=authorization,
        pagina=pagina,
        tamanho_pagina=tamanhoPagina,
    )

    # Extrai a lista de dispositivos da resposta
    dispositivos_raw = []
    total_registros = 0

    if isinstance(data, dict):
        # A API pode retornar em diferentes formatos
        dispositivos_raw = (
            data.get("dispositivos")
            or data.get("dados")
            or data.get("items")
            or data.get("data")
            or []
        )
        total_registros = (
            data.get("totalRegistros")
            or data.get("total")
            or data.get("totalItems")
            or len(dispositivos_raw)
        )
    elif isinstance(data, list):
        dispositivos_raw = data
        total_registros = len(data)

    # Mapeia para o modelo Device
    dispositivos = []
    for d in dispositivos_raw:
        if isinstance(d, dict):
            device = Device(
                id=str(d.get("id", d.get("deviceId", ""))),
                nome=d.get("nome", d.get("name", d.get("nomeDispositivo", ""))),
                modelo=d.get("modelo", d.get("model", "")),
                serial=d.get("serial", d.get("serialNumber", "")),
                mac=d.get("mac", d.get("macAddress", "")),
                firmware=d.get("firmware", d.get("versaoFirmware", "")),
                status=d.get("status", ""),
                online=d.get("online", d.get("isOnline", False)),
                origem=d.get("origem", d.get("origin", "")),
                ultima_vez_online=d.get(
                    "ultimaVezOnline",
                    d.get("lastOnline", d.get("ultima_vez_online", "")),
                ),
                categoria=d.get("categoria", d.get("category", "")),
                tipo=d.get("tipo", d.get("type", "")),
                ip=d.get("ip", d.get("ipAddress", "")),
            )
            dispositivos.append(device)

    # Filtragem por origem (backend-side)
    if origem and origem.lower() != "todos":
        dispositivos = [
            d
            for d in dispositivos
            if d.origem and d.origem.lower() == origem.lower()
        ]
        total_registros = len(dispositivos)

    # Calcula total de páginas
    total_paginas = max(1, (total_registros + tamanhoPagina - 1) // tamanhoPagina)

    return DeviceListResponse(
        dispositivos=dispositivos,
        paginacao=PaginationMeta(
            pagina=pagina,
            tamanho_pagina=tamanhoPagina,
            total_registros=total_registros,
            total_paginas=total_paginas,
        ),
    )
